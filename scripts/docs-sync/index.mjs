#!/usr/bin/env node
/**
 * Publishes the Gland repositories into the documentation site.
 *
 * Everything under `src/content/docs/reference` and the per-repository pages under
 * `src/content/docs/changelog` is produced by this script, at build time, from the
 * documentation that lives in the repositories themselves. Nothing in those
 * directories is edited by hand, so a change to a JSDoc block, a guide or a
 * changelog reaches the site without anyone opening the site repository.
 *
 * Usage:
 *   node scripts/docs-sync/index.mjs              # sync, then write the pages
 *   node scripts/docs-sync/index.mjs --remote     # ignore sibling checkouts
 *   node scripts/docs-sync/index.mjs --local      # fail if a checkout is missing
 *   node scripts/docs-sync/index.mjs --check      # fail if anything is missing/stale
 *   node scripts/docs-sync/index.mjs --watch      # re-sync when a checkout changes
 */

import fsSync from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import { changelogBase, referenceBase, repos, site } from './config.mjs'
import { stringifyFrontmatter } from './lib/frontmatter.mjs'
import { Sources } from './lib/sources.mjs'
import { readChangesets } from './lib/changesets.mjs'
import { referenceSidebar } from './lib/sidebar.mjs'
import { changelogPage, indexPage, referencePage } from './lib/pages.mjs'
import { resolveRelative } from './lib/markdown.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')

const flags = new Set(process.argv.slice(2))
const quiet = flags.has('--quiet')

/** @param {string} message */
const log = (message) => {
  if (!quiet) console.log(message)
}

/** @param {string} message */
const warn = (message) => console.warn(`  ! ${message}`)

async function main() {
  const mode = resolveMode()
  const sources = new Sources({
    root,
    cacheDir: path.join(root, site.cacheDir),
    mode,
    log: warn,
    token: process.env.GITHUB_TOKEN || process.env.GH_TOKEN,
  })

  await fs.mkdir(path.join(root, site.cacheDir), { recursive: true })

  log(`gland docs sync · source: ${mode}`)

  /** @type {Array<{ route: string, file: string, contents: string }>} */
  const written = []
  /** @type {Array<{ repo: any, pages: Array<any>, packages: Array<any>, sha: string | null }>} */
  const manifest = []
  /** @type {Array<{ id: string, version: string, description: string }>} */
  const versions = []
  const problems = []

  for (const repo of repos) {
    const origin = await sources.origin(repo)
    const sha = await sources.commit(repo)
    const short = sha ? sha.slice(0, 7) : repo.ref

    // Resolve which mirrored documents actually exist before building anything.
    const available = []
    for (const page of repo.docs ?? []) {
      const raw = await sources.read(repo, page.from)
      if (raw === null) {
        // `optional` marks a document that is being written but has not landed in the
        // repository yet. Everything else is a mistake, and `--check` fails on it.
        const message = `${repo.id}: ${page.from} not found (${origin})`
        if (page.optional) log(`  - skipped ${page.route} (optional, not in ${origin})`)
        else problems.push(message)
        continue
      }
      available.push({ page, raw })
    }

    const packages = []
    for (const entry of repo.packages ?? []) {
      const json = await sources.json(repo, entry.from)
      if (!json || json.private === true || !json.name) continue
      packages.push({ json, from: entry.from })
      versions.push({ id: repo.id, name: json.name, version: json.version ?? 'unknown' })
    }

    // Repository-relative path -> site route, so cross-links between mirrored
    // documents stay inside the site instead of leaving for GitHub.
    const routeMap = new Map()
    for (const { page } of available) {
      routeMap.set(normalisePath(page.from), `${referenceBase}/${repo.id}${page.route === 'index' ? '' : `/${page.route}`}`)
    }

    /**
     * Links resolve in three steps: an exact mirrored route, a route with a trailing
     * `/README` stripped (`docs/README.md` -> `docs/api/README.md` is *not* matched,
     * but `architecture/README.md` -> `architecture` is), and finally the file on
     * GitHub. A link that resolves to nothing on the site is worse than one that
     * resolves to the upstream document.
     */
    const resolveLink = (fromFile) => (target) => {
      const resolved = resolveRelative(fromFile, target)
      if (!resolved) return null

      const candidates = [normalisePath(resolved)]
      if (/README\.md$/i.test(candidates[0])) {
        candidates.push(candidates[0].replace(/README\.md$/i, '').replace(/\/$/, ''))
      }

      for (const candidate of candidates) {
        const route = routeMap.get(candidate)
        if (route) return route
      }

      return blobUrl(repo, normalisePath(resolved))
    }

    log(`\n${repo.label}  (${origin}, ${short})`)

    const pages = []

    for (const { page, raw } of available) {
      // A monorepo page can name the single package it documents. Without that, an
      // adapter README would be decorated with the whole workspace's install line.
      const scoped = page.package
        ? packages.filter((entry) => entry.from === page.package)
        : packages

      const generated = await referencePage({
        repo,
        page,
        packages: scoped.length ? scoped : packages,
        sha,
        raw,
        resolveLink: resolveLink(page.from),
        urlFor: (file) => sources.url(repo, file),
        rawUrlFor: async (file) => {
          const resolved = resolveRelative(page.from, file)
          return resolved ? sources.rawUrl(repo, resolved) : null
        },
      })

      const route = `${referenceBase}/${repo.id}${page.route === 'index' ? '' : `/${page.route}`}`
      written.push({
        route,
        file: outputPath(route),
        contents: render(generated),
      })
      pages.push({ route: page.route, title: generated.frontmatter.title, sidebar: page.sidebar })
      log(`  · ${route}`)
    }

    // A repository without an overview document still gets an index, so the
    // namespace it owns is never a dead end.
    if (!available.some(({ page }) => page.route === 'index')) {
      const generated = indexPage({ repo, packages, docs: available.map(({ page }) => ({ page, route: page.route })) })
      const route = `${referenceBase}/${repo.id}`
      written.push({ route, file: outputPath(route), contents: render(generated) })
      pages.unshift({ route: 'index', title: generated.frontmatter.title, sidebar: { label: 'Overview', order: 0 } })
      log(`  · ${route} (generated index)`)
    }

    if (repo.changelog) {
      const raw = await sources.read(repo, repo.changelog.from)
      if (raw === null) {
        warn(`${repo.id}: ${repo.changelog.from} not found (${origin})`)
      }

      let changesets = []
      if (repo.changelog.changesets) {
        try {
          changesets = await readChangesets(sources, repo, repo.changelog.changesets)
        } catch (error) {
          warn(`${repo.id}: could not read changesets (${error.message})`)
        }
      }

      const generated = changelogPage({
        repo,
        raw,
        sha,
        editUrl: (await sources.url(repo, repo.changelog.from)) ?? undefined,
        changesets,
        packages,
      })

      written.push({
        route: `${changelogBase}/${repo.id}`,
        file: outputPath(`${changelogBase}/${repo.id}`),
        contents: render(generated),
      })
      log(`  · ${changelogBase}/${repo.id}${changesets.length ? ` (+${changesets.length} pending)` : ''}`)
    }

    manifest.push({ repo, pages, packages, sha })
  }

  // Remove files written by a previous run that the config no longer produces.
  const previous = await readManifestFiles()
  const keep = new Set(written.map((entry) => entry.file))
  for (const file of previous) {
    if (!keep.has(file)) await remove(path.join(root, file))
  }

  // `--check` is a preflight: it proves every declared source is readable without
  // touching the content collection. The build does the writing.
  if (!flags.has('--check')) {
    for (const entry of written) {
      await fs.mkdir(path.dirname(entry.file), { recursive: true })
      await fs.writeFile(entry.file, entry.contents, 'utf8')
    }
    await writeManifestFiles(written.map((entry) => entry.file))
  }

  await writeDataModule(manifest, versions)

  log(`\n${written.length} pages${flags.has('--check') ? ' resolved' : ' generated'}`)

  if (problems.length) {
    for (const problem of problems) warn(problem)
    if (flags.has('--check')) {
      console.error(`\ndocs sync failed with ${problems.length} problem(s).`)
      process.exitCode = 1
      return
    }
  }

  if (flags.has('--check')) log('check passed')

  if (flags.has('--watch')) await watch()
}

function resolveMode() {
  if (flags.has('--remote')) return 'remote'
  if (flags.has('--local')) return 'local'
  const env = process.env.GLAND_DOCS_SOURCE
  if (env === 'local' || env === 'remote' || env === 'auto') return env
  return 'auto'
}

/** @param {{ frontmatter: Record<string, unknown>, body: string }} page */
function render(page) {
  return `${stringifyFrontmatter(page.frontmatter)}\n${page.body}`
}

/** @param {string} route */
function outputPath(route) {
  const relative = route.replace(/^\//, '')
  return path.join(site.contentDir, `${relative}.md`)
}

function normalisePath(file) {
  return file.split(path.sep).join('/').replace(/^\.\//, '')
}

/** GitHub URL for a file on the configured ref. Synchronous, unlike `Sources.url`. */
function blobUrl(repo, file) {
  const encoded = file.split('/').map(encodeURIComponent).join('/')
  return `https://github.com/${repo.repo}/blob/${repo.ref}/${encoded}`
}

async function readManifestFiles() {
  try {
    const raw = await fs.readFile(path.join(root, site.cacheDir, 'written.json'), 'utf8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/** @param {string[]} files */
async function writeManifestFiles(files) {
  await fs.writeFile(path.join(root, site.cacheDir, 'written.json'), JSON.stringify(files, null, 2), 'utf8')
}

async function remove(file) {
  try {
    await fs.rm(file, { force: true })
    log(`  - removed ${path.relative(root, file)}`)
  } catch {
    /* already gone */
  }
}

/**
 * Writes the machine-readable manifest the site imports.
 *
 * Two consumers: `sidebar.mjs`, which merges the generated groups, and
 * `packages.mjs`, which reads versions straight from this file so a package card can
 * never advertise a version that was never published.
 */
async function writeDataModule(manifest, versions) {
  const module = [
    '/**',
    ' * GENERATED FILE — do not edit.',
    ' *',
    ' * Written by `scripts/docs-sync/index.mjs` from `scripts/docs-sync/config.mjs`',
    ' * and the package manifests in the Gland repositories. Run `pnpm docs:sync`',
    ' * (or any build) to refresh it.',
    ' */',
    '',
    '/** Repository id -> the commit the mirrored pages were generated from. */',
    `export const commits = ${JSON.stringify(Object.fromEntries(manifest.map((entry) => [entry.repo.id, entry.sha])), null, 2)}`,
    '',
    '/** npm package name -> the version its repository currently declares. */',
    `export const versions = ${JSON.stringify(Object.fromEntries(versions.map((entry) => [entry.name, entry.version])), null, 2)}`,
    '',
    '/** Repository id -> the labels and routes of its mirrored pages. */',
    `export const mirrors = ${JSON.stringify(
      Object.fromEntries(
        manifest.map((entry) => [
          entry.repo.id,
          {
            repo: entry.repo.repo,
            ref: entry.repo.ref,
            packages: entry.packages.map((item) => item.json.name),
            pages: entry.pages.map((page) => ({ route: page.route, title: page.title })),
          },
        ]),
      ),
      null,
      2,
    )}`,
    '',
    '/** Sidebar groups for everything mirrored from the repositories. */',
    `export const referenceGroups = ${JSON.stringify(referenceSidebar(manifest), null, 2)}`,
    '',
  ].join('\n')

  const file = path.join(root, site.dataFile)
  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(file, `${module}\n`, 'utf8')
}

/**
 * Re-runs the sync when a watched checkout changes.
 *
 * Recursive watching is not atomic per event — one save produces several — so events
 * are coalesced into a single re-run.
 */
async function watch() {
  const targets = repos
    .map((repo) => path.join(root, '..', repo.workspace))
    .filter(Boolean)

  log(`\nwatching ${targets.length} checkout(s) for changes…`)

  let timer
  const schedule = () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      console.clear()
      main().catch((error) => {
        console.error(error)
        process.exitCode = 1
      })
    }, 400)
  }

  for (const target of targets) {
    try {
      fsSync.watch(target, { recursive: true }, schedule)
    } catch (error) {
      warn(`${path.relative(root, target)}: ${error.message}`)
    }
  }
}

main().catch((error) => {
  console.error(`\ndocs sync failed: ${error.message}`)
  if (process.env.GLAND_DEBUG) console.error(error)
  process.exitCode = 1
})