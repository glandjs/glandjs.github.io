/**
 * A deliberately small YAML front-matter reader and writer.
 *
 * Starlight reads front matter through `js-yaml`, but the sync script only ever
 * needs to read the handful of scalars that upstream documents declare and to
 * write the ones it controls, so a dependency-free implementation keeps the docs
 * site installable from a single `pnpm install`.
 *
 * Supported on read: `key: value`, single/double quoted strings, flow sequences
 * `[a, b]`, block sequences and nested one-level maps. Anything more exotic is
 * preserved verbatim as a string rather than guessed at.
 */

/** @param {string} raw */
export function parseFrontmatter(raw) {
  const text = raw.replace(/\r\n?/g, '\n')
  const match = /^---\n([\s\S]*?)\n---(?:\n|$)/.exec(text)
  if (!match) return { data: {}, body: text }

  return { data: parseBlock(match[1]), body: text.slice(match[0].length) }
}

/**
 * Parses a YAML block into a plain object. Nested structures are limited to what
 * front matter realistically uses.
 * @param {string} block
 */
function parseBlock(block) {
  /** @type {Record<string, unknown>} */
  const data = {}
  const lines = block.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim() || line.trimStart().startsWith('#')) continue

    const separator = line.indexOf(':')
    if (separator === -1) continue

    const key = line.slice(0, separator).trim()
    const rest = line.slice(separator + 1).trim()

    if (rest === '') {
      const nested = readNested(lines, i + 1)
      if (nested) {
        data[key] = nested.value
        i = nested.next - 1
        continue
      }
      data[key] = ''
      continue
    }

    data[key] = parseScalar(rest)
  }

  return data
}

/**
 * Reads either a block sequence (`- item`) or a nested map, starting at `start`.
 * @param {string[]} lines
 * @param {number} start
 * @returns {{ value: unknown, next: number } | null}
 */
function readNested(lines, start) {
  let index = start
  while (index < lines.length && !lines[index].trim()) index++
  if (index >= lines.length) return null

  const line = lines[index]
  const indent = line.length - line.trimStart().length

  if (line.trimStart().startsWith('- ')) {
    const items = []
    while (index < lines.length) {
      const current = lines[index]
      if (!current.trim()) {
        index++
        continue
      }
      const currentIndent = current.length - current.trimStart().length
      if (currentIndent < indent || !current.trimStart().startsWith('- ')) break
      items.push(parseScalar(current.trimStart().slice(2)))
      index++
    }
    return { value: items, next: index }
  }

  const nested = {}
  while (index < lines.length) {
    const current = lines[index]
    if (!current.trim()) {
      index++
      continue
    }
    const currentIndent = current.length - current.trimStart().length
    if (currentIndent < indent) break
    if (currentIndent > indent) {
      index++
      continue
    }
    const separator = current.indexOf(':')
    if (separator === -1) {
      index++
      continue
    }
    nested[current.slice(0, separator).trim()] = parseScalar(current.slice(separator + 1).trim())
    index++
  }
  return { value: nested, next: index }
}

/** @param {string} value */
function parseScalar(value) {
  const text = value.trim()

  if (text === '' ) return ''
  if (text === 'true') return true
  if (text === 'false') return false
  if (text === 'null' || text === '~') return null

  if (text.startsWith('[') && text.endsWith(']')) {
    const inner = text.slice(1, -1).trim()
    if (!inner) return []
    return splitFlow(inner).map((item) => parseScalar(item))
  }

  if (
    (text.startsWith('"') && text.endsWith('"') && text.length > 1) ||
    (text.startsWith("'") && text.endsWith("'") && text.length > 1)
  ) {
    const quote = text[0]
    const inner = text.slice(1, -1)
    return quote === '"' ? inner.replace(/\\"/g, '"').replace(/\\n/g, '\n') : inner.replace(/''/g, "'")
  }

  // Strip a trailing `# comment` only when the value is not quoted and the `#`
  // is preceded by whitespace, so URLs and hex colours survive.
  const comment = /\s#\s/.exec(text)
  const cleaned = comment ? text.slice(0, comment.index) : text

  if (/^-?\d+$/.test(cleaned)) return Number.parseInt(cleaned, 10)
  if (/^-?\d*\.\d+$/.test(cleaned)) return Number.parseFloat(cleaned)

  return cleaned
}

/** Splits a flow sequence on commas that are not inside quotes. */
function splitFlow(input) {
  const parts = []
  let current = ''
  let quote = ''

  for (const char of input) {
    if (quote) {
      current += char
      if (char === quote) quote = ''
      continue
    }
    if (char === '"' || char === "'") {
      quote = char
      current += char
      continue
    }
    if (char === ',') {
      parts.push(current.trim())
      current = ''
      continue
    }
    current += char
  }

  if (current.trim()) parts.push(current.trim())
  return parts
}

/**
 * Serialises a front-matter object. Values are emitted as JSON scalars where that
 * is unambiguous (strings quoted, so a value never starts a comment) and as bare
 * scalars otherwise.
 * @param {Record<string, unknown>} data
 */
export function stringifyFrontmatter(data) {
  const lines = ['---']

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue

    if (Array.isArray(value)) {
      lines.push(`${key}:`)
      for (const item of value) lines.push(`  - ${scalar(item)}`)
      continue
    }

    lines.push(`${key}: ${scalar(value)}`)
  }

  lines.push('---', '')
  return lines.join('\n')
}

/** @param {unknown} value */
function scalar(value) {
  if (typeof value === 'string') return JSON.stringify(value)
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (value && typeof value === 'object') return JSON.stringify(value)
  return '""'
}