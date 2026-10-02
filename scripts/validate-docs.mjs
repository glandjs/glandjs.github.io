/**
 * Parses every documentation file with the same Markdown parser Astro uses, and
 * reports anything that would fail a build.
 *
 * Run with `node scripts/validate-docs.mjs`. It is not part of the build; it exists so
 * a broken document can be found without one.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import { fromMarkdown } from 'mdast-util-from-markdown'
import { directive } from 'micromark-extension-directive'
import { VFile } from 'vfile'
import { visit } from 'unist-util-visit'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const docsDir = path.join(root, 'src/content/docs')

/** Recursively lists documentation files. */
async function collect(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...(await collect(full)))
    else if (/\.mdx?$/.test(entry.name)) files.push(full)
  }
  return files
}

const failures = []

for (const docPath of await collect(docsDir)) {
  const source = await fs.readFile(docPath, 'utf8')
  const relative = path.relative(root, docPath)
  const body = source.replace(/^---\n[\s\S]*?\n---\n/, '')

  // A vfile collects recoverable parse errors; without one they are thrown instead.
  const file = new VFile({ value: body, path: docPath })
  const tree = fromMarkdown(body, {
    extensions: [directive()],
    file,
  })

  for (const message of file.messages) {
    if (message.fatal) failures.push(`${relative}: ${message.reason}`)
  }

  // A directive that is opened and never closed renders as literal text, which is
  // invisible in a diff and very obvious on the page. Count the markers.
  const marks = (body.match(/^:::/gm) || []).length
  if (marks % 2 !== 0) {
    failures.push(`${relative}: unbalanced ::: markers (${marks})`)
  }

  const used = new Set()
  visit(tree, (node) => {
    if (
      node.type === 'containerDirective' ||
      node.type === 'leafDirective' ||
      node.type === 'textDirective'
    ) {
      used.add(node.name)
    }
  })

  // Starlight recognises exactly four container directives. Anything else is left in
  // the tree unrendered, so it is worth failing on rather than shipping.
  const known = /^(note|tip|caution|danger)$/
  const unknown = [...used].filter((name) => !known.test(name))
  if (unknown.length) {
    failures.push(`${relative}: unknown directive(s) ${unknown.join(', ')}`)
  }
}

if (failures.length) {
  for (const failure of failures) console.error(`  ! ${failure}`)
  console.error(`\n${failures.length} documentation problem(s).`)
  process.exitCode = 1
} else {
  console.log('All documentation files parse cleanly.')
}