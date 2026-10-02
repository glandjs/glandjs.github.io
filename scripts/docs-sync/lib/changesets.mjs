import { parseFrontmatter } from './frontmatter.mjs'

/**
 * Reads a Changesets workspace.
 *
 * A changeset is a Markdown file whose front matter maps package names to a bump
 * type. Reading them lets the site document behaviour that is written but not yet
 * published — the window where documentation usually lags the code.
 */

/**
 * @param {import('./sources.mjs').Sources} sources
 * @param {import('../config.mjs').repos[number]} repo
 * @param {string} folder
 * @returns {Promise<Array<{ name: string, body: string, packages: string[], bump: Record<string, string> }>>}
 */
export async function readChangesets(sources, repo, folder) {
  const manifest = await sources.json(repo, `${folder}/config.json`)
  if (!manifest) return []

  const { readdir } = await import('node:fs/promises')
  const path = await import('node:path')
  const { origin } = { origin: await sources.origin(repo) }

  const files = await listFiles(sources, repo, folder, readdir, path, origin)
  const entries = []

  for (const file of files) {
    if (!file.endsWith('.md')) continue
    if (file === 'README.md') continue

    const raw = await sources.read(repo, file)
    if (!raw) continue

    const { data, body } = parseFrontmatter(raw)
    const bump = /** @type {Record<string, string>} */ ({})

    for (const [key, value] of Object.entries(data)) {
      const name = key.replace(/^['"]|['"]$/g, '').trim()
      if (typeof value === 'string' && value) bump[name] = value
    }

    entries.push({
      name: file.slice(folder.length + 1, -3),
      body: body.trim(),
      packages: Object.keys(bump),
      bump,
    })
  }

  entries.sort((a, b) => a.name.localeCompare(b.name))
  return entries
}

/**
 * Lists Markdown files in a changeset folder. Over the network the folder listing
 * comes from the GitHub API; locally it is a plain directory read.
 */
async function listFiles(sources, repo, folder, readdir, nodePath, origin) {
  if (origin === 'local') {
    const root = nodePath.resolve(sources.root, '..', repo.workspace, folder)
    try {
      const names = await readdir(root)
      return names.map((name) => `${folder}/${name}`)
    } catch {
      return []
    }
  }

  const commit = await sources.commit(repo)
  const url = `https://api.github.com/repos/${repo.repo}/contents/${folder}?ref=${commit ?? repo.ref}`
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 15_000)

  try {
    const response = await fetch(url, {
      headers: sources.token ? { authorization: `Bearer ${sources.token}` } : {},
      signal: controller.signal,
    })
    if (!response.ok) return []

    const listing = await response.json()
    if (!Array.isArray(listing)) return []
    return listing
      .filter((item) => item && typeof item.path === 'string' && item.type === 'file')
      .map((item) => item.path)
  } catch {
    return []
  } finally {
    clearTimeout(timer)
  }
}