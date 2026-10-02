import { cell, convert, dependencyList } from './markdown.mjs'

/**
 * Page templates.
 *
 * Every generated page is a Starlight document: YAML front matter, then Markdown.
 * Nothing here imports Astro, so the output can be inspected (and diffed) without a
 * build.
 */

const MANAGERS = [
  ['pnpm', 'pnpm add'],
  ['npm', 'npm install'],
  ['yarn', 'yarn add'],
  ['bun', 'bun add'],
]

/**
 * Install command, one line per package manager.
 *
 * Generated pages are plain Markdown, which Starlight renders without MDX. Its
 * `:::tabs` directive is not part of the four aside variants Starlight recognises, so a
 * single fenced block is the portable choice — and it stays copy-pasteable, which is
 * the whole point of an install command.
 *
 * @param {string[]} names
 */
function installBlock(names) {
  if (!names.length) return ''

  const width = Math.max(...MANAGERS.map(([manager]) => manager.length))
  const lines = MANAGERS.map(([manager, command]) => `# ${manager.padEnd(width)}  ${command} ${names.join(' ')}`)

  return ['```bash', ...lines, '```'].join('\n')
}

/** Strips the private-workspaces flag out of a package list. */
function publishedPackages(entries) {
  return entries.filter((entry) => entry.json && entry.json.private !== true)
}

/**
 * Metadata table for one package. Rendered above a mirrored document so the page
 * never disagrees with the manifest it was generated from.
 *
 * @param {{ json: Record<string, any>, from: string, repo: any }} entry
 */
function packageTable(entry, repo) {
  const json = entry.json
  const rows = [
    ['Package', `\`${json.name}\``],
    ['Version', `\`${json.version ?? 'unknown'}\``],
    ['Repository', repo.url],
    ['License', json.license ?? '—'],
  ]

  if (json.engines?.node) rows.push(['Node', `\`${json.engines.node}\``])
  if (json.engines?.bun) rows.push(['Bun', `\`${json.engines.bun}\``])
  if (json.engines?.typescript) rows.push(['TypeScript', `\`${json.engines.typescript}\``])
  if (json.dependencies && Object.keys(json.dependencies).length) {
    rows.push(['Dependencies', dependencyList(json.dependencies)])
  }
  if (json.peerDependencies && Object.keys(json.peerDependencies).length) {
    rows.push(['Peer dependencies', dependencyList(json.peerDependencies)])
  }

  const lines = ['| | |', '| --- | --- |']
  for (const [label, value] of rows) lines.push(`| **${label}** | ${value} |`)
  return lines.join('\n')
}

/** The "this page is generated" banner, including the exact upstream commit. */
function provenanceAside({ repo, file, sha, editUrl, extra = '' }) {
  const short = sha ? sha.slice(0, 7) : repo.ref
  const lines = [
    // No backticks in a directive label: Starlight reads the label as a plain string,
    // and a code span inside a callout title reads badly.
    `:::note[Synced from ${repo.repo}]`,
    `This page is generated from \`${file}\` on \`${repo.ref}\` at \`${short}\`${extra}.`,
    'Edit the document in its own repository and it will be republished on the next build.',
  ]
  if (editUrl) lines.push(`[Open the source on GitHub](${editUrl})`)
  lines.push(':::')
  return lines.join('\n')
}

/**
 * Builds a mirrored reference page.
 *
 * @param {object} input
 * @param {import('../config.mjs').repos[number]} input.repo
 * @param {(import('../config.mjs').repos[number]['docs'])[number]} input.page
 * @param {{ repo: any, packages: Array<{ json: Record<string, any>, from: string, repo: any }>, sha: string | null }} input.packages
 * @param {(file: string) => string | null} input.routeFor Repository path -> site route.
 * @param {(file: string) => Promise<string | null>} input.urlFor Repository path -> GitHub URL.
 * @param {(file: string) => Promise<string | null>} input.rawUrlFor
 * @param {(file: string) => string | null} input.resolveLink
 * @param {string} input.raw
 */
export async function referencePage({
  repo,
  page,
  packages,
  sha,
  resolveLink,
  urlFor,
  rawUrlFor,
  raw,
}) {
  const editUrl = await urlFor(page.from)

  const resolved = resolveLink(page.from)
  const { body } = convert({
    raw,
    title: page.title,
    resolveLink: (target) => resolved ?? resolveLink(target),
    resolveAsset: (target) => rawUrlFor(target),
  })

  /** @type {string[]} */
  const parts = []

  const primary = packages[0]
  if (primary) {
    parts.push(installBlock(packages.map((entry) => entry.json.name)))
    parts.push('')
    parts.push(packageTable(primary, { url: `[${repo.repo}](https://github.com/${repo.repo})` }))
  }

  parts.push('')
  parts.push(provenanceAside({ repo, file: page.from, sha, editUrl }))
  parts.push('')
  parts.push(body)

  const versions = packages
    .map((entry) => `${entry.json.name}@${entry.json.version}`)
    .join(' · ')

  return {
    frontmatter: {
      title: page.title,
      description: page.description ?? `Mirrored from ${repo.repo}/${page.from}.`,
      ...(primary ? { badge: `${primary.json.name}@${primary.json.version}` } : {}),
      editUrl,
    },
    body: `${parts.join('\n').replace(/\n{3,}/g, '\n\n').trim()}\n`,
    route: page.route,
    versions,
  }
}

/**
 * Builds the per-repository index: what the packages are, what the repository
 * contains, and where each mirrored document lives.
 *
 * @param {object} input
 * @param {import('../config.mjs').repos[number]} input.repo
 * @param {Array<{ json: Record<string, any>, from: string }>} input.packages
 * @param {Array<{ page: any, route: string }>} input.docs
 */
export function indexPage({ repo, packages, docs }) {
  const editUrl = `https://github.com/${repo.repo}`

  /** @type {string[]} */
  const parts = []

  parts.push(
    [
      `:::note[Synced from ${repo.repo}]`,
      `Everything on this page is generated from the \`${repo.repo}\` workspace. Add a file to \`config.mjs\` to publish another document from it.`,
      `:::`,
    ].join('\n'),
    '',
  )

  const published = publishedPackages(packages)
  if (published.length) {
    parts.push('## Packages', '')
    parts.push(installBlock(published.map((entry) => entry.json.name)))
    parts.push('')
    parts.push('| Package | Version | Description |', '| --- | --- | --- |')
    for (const entry of published) {
      parts.push(
        `| \`${entry.json.name}\` | \`${entry.json.version}\` | ${cell(entry.json.description)} |`,
      )
    }
    parts.push('')
  }

  if (docs.length) {
    parts.push('## Documentation', '')
    parts.push('| Page | Source |', '| --- | --- |')
    for (const { page, route } of docs) {
      parts.push(
        `| [${page.title}](/reference/${repo.id}${route === 'index' ? '' : `/${route}`}) | \`${page.from}\` |`,
      )
    }
    parts.push('')
  }

  parts.push('## Repository', '')
  parts.push(`- Source: [${repo.repo}](${editUrl})`)
  parts.push(`- Branch: \`${repo.ref}\``)
  parts.push(`- Changelog: [/${'changelog'}/${repo.id}](/changelog/${repo.id})`)
  parts.push('')

  return {
    frontmatter: {
      title: `${repo.label} reference`,
      description: `Every document mirrored from the ${repo.repo} repository, kept in sync on every build.`,
      badge: published.map((entry) => `${entry.json.name}@${entry.json.version}`).join(' · ') || undefined,
      editUrl,
    },
    body: `${parts.join('\n').replace(/\n{3,}/g, '\n\n').trim()}\n`,
    route: 'index',
  }
}

/**
 * Builds a changelog page.
 *
 * A repository may or may not keep a hand-written `CHANGELOG.md`; the HTTP
 * repositories use changesets instead. Both are handled here, and a changeset-only
 * repository gets an "Unreleased" section so pending work is visible before it ships.
 *
 * @param {object} input
 * @param {import('../config.mjs').repos[number]} input.repo
 * @param {string | null} input.raw
 * @param {string | null} input.sha
 * @param {string | null} input.editUrl
 * @param {Array<{ name: string, body: string, bodyHtml: string, packages: string[], bump: Record<string, string> }>} input.changesets
 * @param {Array<{ json: Record<string, any> }>} input.packages
 */
export function changelogPage({ repo, raw, sha, editUrl, changesets, packages }) {
  const versions = packages.map((entry) => `${entry.json.name}@${entry.json.version}`).join(' · ')

  /** @type {string[]} */
  const parts = []

  const short = sha ? sha.slice(0, 7) : repo.ref

  if (!raw) {
    parts.push(
      [
        `:::caution[No published changelog]`,
        `\`${repo.repo}\` does not keep a hand-written \`CHANGELOG.md\`. Releases are driven by [changesets](https://github.com/changesets/changesets), which means the authoritative history lives on npm.`,
        `:::`,
      ].join('\n'),
      '',
    )
  }

  if (changesets.length) {
    parts.push(`## Unreleased`, '')
    parts.push(
      [
        ':::note[Pending changesets]',
        `${changesets.length} changeset${changesets.length === 1 ? '' : 's'} in \`${repo.repo}/${repo.changesetFolder ?? '.changeset'}\` have not been released yet. They are published verbatim below and disappear once the release lands.`,
        ':::',
      ].join('\n'),
      '',
    )

    for (const changeset of changesets) {
      parts.push(`### ${changeset.name}`)
      parts.push('')
      if (changeset.packages.length) {
        parts.push(
          `**${changeset.packages.map((name) => `\`${name}\``).join(', ')}** — ${
            Object.entries(changeset.bump)
              .map(([name, level]) => `${name} ${level}`)
              .join(', ') || 'pending'
          }`,
        )
        parts.push('')
      }
      parts.push(changeset.body)
      parts.push('')
    }
  }

  if (raw) {
    const { body } = convert({ raw, title: 'Changelog', resolveLink: () => null })
    parts.push(body)
  }

  parts.push('')
  parts.push('---')
  parts.push('')
  parts.push(
    [
      `:::note[Source]`,
      `Synced from \`${repo.repo}/${repo.changelog.from}\` on \`${repo.ref}\` at \`${short}\`.${
        editUrl ? ` [Edit on GitHub](${editUrl}).` : ''
      }`,
      `:::`,
    ].join('\n'),
  )

  return {
    frontmatter: {
      title: `Changelog — ${repo.label}`,
      description: `Release history for ${repo.label}, mirrored from the repository.`,
      ...(versions ? { badge: versions } : {}),
      ...(editUrl ? { editUrl } : {}),
    },
    body: `${parts.join('\n').replace(/\n{3,}/g, '\n\n').trim()}\n`,
    route: repo.id,
  }
}