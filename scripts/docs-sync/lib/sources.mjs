import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'

/**
 * Resolves documents out of the Gland repositories.
 *
 * Two origins are supported and both return the same shape:
 *
 *   local   a sibling checkout (`../<workspace>`), optionally any branch or even
 *           an uncommitted working tree. This is the default when the folder
 *           exists, so a change is documented before it is pushed.
 *   remote  `raw.githubusercontent.com`, with a conditional-request cache so a
 *           rebuild only downloads what actually changed.
 *
 * Every read is recorded, which lets the caller report exactly which upstream
 * commit a published page came from.
 */
export class Sources {
  /**
   * @param {object} options
   * @param {string} options.root Repository root of the docs site.
   * @param {string} options.cacheDir Absolute path to the HTTP cache.
   * @param {'auto'|'local'|'remote'} options.mode
   * @param {(message: string) => void} options.log
   * @param {string} [options.token] GitHub token, raises the API rate limit.
   */
  constructor({ root, cacheDir, mode, log, token }) {
    this.root = root
    this.cacheDir = cacheDir
    this.mode = mode
    this.log = log
    this.token = token
    /** @type {Map<string, string | null>} repo id -> commit sha */
    this.commits = new Map()
    /** @type {Map<string, { origin: string, reason?: string }>} */
    this.origins = new Map()
  }

  /** Absolute path of the sibling checkout for a repository, when it exists. */
  async #workspace(repo) {
    const dir = path.resolve(this.root, '..', repo.workspace)
    try {
      const stats = await fs.stat(dir)
      if (!stats.isDirectory()) return null
      return dir
    } catch {
      return null
    }
  }

  /**
   * Decides, per repository, whether to read locally or over the network.
   * @param {import('../config.mjs').repos[number]} repo
   */
  async origin(repo) {
    const cached = this.origins.get(repo.id)
    if (cached) return cached.origin

    let origin = 'remote'
    if (this.mode === 'local') origin = 'local'
    else if (this.mode === 'remote') origin = 'remote'
    else origin = (await this.#workspace(repo)) ? 'local' : 'remote'

    this.origins.set(repo.id, { origin })
    return origin
  }

  /**
   * Resolves the commit every page of a repository is generated from.
   *
   * A pinned commit is what makes a build reproducible: the same run always reads
   * the same bytes, even if a branch moves halfway through.
   * @param {import('../config.mjs').repos[number]} repo
   * @returns {Promise<string | null>}
   */
  async commit(repo) {
    if (this.commits.has(repo.id)) return this.commits.get(repo.id) ?? null

    let sha = null
    const origin = await this.origin(repo)

    if (origin === 'local') {
      const dir = await this.#workspace(repo)
      try {
        sha = execFileSync('git', ['-C', dir, 'rev-parse', 'HEAD'], {
          encoding: 'utf8',
          stdio: ['ignore', 'pipe', 'ignore'],
        }).trim()
      } catch {
        this.log(`  ! ${repo.id}: no git history, falling back to raw file contents`)
      }
    } else {
      sha = await this.#remoteCommit(repo)
    }

    this.commits.set(repo.id, sha)
    return sha
  }

  async #remoteCommit(repo) {
    const url = `https://api.github.com/repos/${repo.repo}/commits/${repo.ref}`
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 10_000)

    try {
      const response = await fetch(url, {
        headers: this.#headers(),
        signal: controller.signal,
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const body = await response.json()
      return typeof body?.sha === 'string' ? body.sha : null
    } catch (error) {
      this.log(`  ! ${repo.id}: could not resolve ${repo.ref} (${error.message})`)
      return null
    } finally {
      clearTimeout(timer)
    }
  }

  #headers() {
    /** @type {Record<string, string>} */
    const headers = { 'user-agent': 'gland-docs-sync' }
    if (this.token) headers.authorization = `Bearer ${this.token}`
    return headers
  }

  /**
   * Reads a UTF-8 text file.
   * @param {import('../config.mjs').repos[number]} repo
   * @param {string} file Repository-relative path.
   * @returns {Promise<string | null>} `null` when the file does not exist.
   */
  async read(repo, file) {
    const origin = await this.origin(repo)

    if (origin === 'local') {
      const dir = await this.#workspace(repo)
      if (!dir) {
        // `local` was requested explicitly, so a missing checkout is a mistake worth
        // failing on rather than a reason to silently publish nothing.
        throw new Error(
          `${repo.repo}: no checkout at ${path.resolve(this.root, '..', repo.workspace)}. ` +
            'Clone it next to the site, or run with --remote.',
        )
      }
      try {
        return await fs.readFile(path.join(dir, file), 'utf8')
      } catch {
        return null
      }
    }

    return this.#remoteRead(repo, file)
  }

  async #remoteRead(repo, file) {
    const commit = await this.commit(repo)
    const key = `${repo.repo}@${commit ?? repo.ref}:${file}`
    const cachePath = path.join(this.cacheDir, hash(key))
    const metaPath = `${cachePath}.meta.json`

    const headers = this.#headers()
    const meta = await readJson(metaPath)

    if (meta?.etag) headers['if-none-match'] = meta.etag

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 20_000)

    try {
      const response = await fetch(this.#rawUrl(repo, commit, file), { headers, signal: controller.signal })

      if (response.status === 304 && meta?.body !== undefined) {
        return meta.body
      }
      if (!response.ok) {
        if (response.status === 404) return null
        throw new Error(`HTTP ${response.status}`)
      }

      const body = await response.text()
      await writeJson(metaPath, { etag: response.headers.get('etag'), body })
      return body
    } catch (error) {
      // A stale cache entry beats a failed build: report it and carry on.
      if (meta?.body !== undefined) {
        this.log(`  ! ${repo.id}/${file}: ${error.message}, using the cached copy`)
        return meta.body
      }
      throw new Error(`${repo.repo}/${file}: ${error.message}`)
    } finally {
      clearTimeout(timer)
    }
  }

  #rawUrl(repo, commit, file) {
    const ref = commit ?? repo.ref
    return `https://raw.githubusercontent.com/${repo.repo}/${ref}/${file
      .split('/')
      .map(encodeURIComponent)
      .join('/')}`
  }

  /**
   * Reads and parses a JSON file.
   * @param {import('../config.mjs').repos[number]} repo
   * @param {string} file
   * @returns {Promise<Record<string, any> | null>}
   */
  async json(repo, file) {
    const text = await this.read(repo, file)
    if (text === null) return null
    try {
      return JSON.parse(text)
    } catch (error) {
      throw new Error(`${repo.repo}/${file}: invalid JSON (${error.message})`)
    }
  }

  /**
   * Public URL of a file in the repository, used for "edit this page" links and
   * for images that live next to the documentation.
   * @param {import('../config.mjs').repos[number]} repo
   * @param {string} file
   * @param {'blob'|'raw'} kind
   */
  async url(repo, file, kind = 'blob') {
    const commit = await this.commit(repo)
    const ref = kind === 'raw' ? (commit ?? repo.ref) : repo.ref
    return `https://github.com/${repo.repo}/${kind}/${ref}/${file
      .split('/')
      .map(encodeURIComponent)
      .join('/')}`
  }

  /** Public URL of a raw asset (images). */
  async rawUrl(repo, file) {
    return this.#rawUrl(repo, await this.commit(repo), file)
  }
}

/** @param {string} value */
function hash(value) {
  return createHash('sha1').update(value).digest('hex').slice(0, 32)
}

/** @param {string} file */
async function readJson(file) {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'))
  } catch {
    return null
  }
}

/** @param {string} file @param {unknown} value */
async function writeJson(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(file, JSON.stringify(value), 'utf8')
}