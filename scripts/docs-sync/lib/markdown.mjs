import { parseFrontmatter } from './frontmatter.mjs'

/**
 * Markdown in, Starlight-ready Markdown out.
 *
 * The output is `.md` rather than `.mdx` on purpose: a plain remark pipeline cannot
 * choke on a stray `{` or `<` in prose, so an upstream typo degrades into a typo
 * instead of a failed build. Asides are still available, because Starlight installs
 * `remark-directive` for every documentation file.
 */

/**
 * Splits a document into its front matter and body, and reports the document's
 * own title so the caller can promote it to page front matter.
 *
 * @param {string} raw
 * @returns {{ data: Record<string, unknown>, body: string, title: string | null }}
 */
export function readDocument(raw) {
  const { data, body } = parseFrontmatter(normalise(raw))
  const heading = firstHeading(body)

  return {
    data,
    body: stripFrontmatterBody(body),
    title: typeof data.title === 'string' && data.title ? data.title : heading?.text ?? null,
  }
}

/**
 * Converts an upstream document into the body of a generated page.
 *
 * @param {object} options
 * @param {string} options.raw The file as read from the repository.
 * @param {string} options.title Title to promote, and to drop from the body.
 * @param {(target: string) => string | null} [options.resolveLink]
 *   Maps a repository-relative link target to a site route, or returns `null` to
 *   leave the link untouched.
 * @param {(target: string) => string | null} [options.resolveAsset]
 *   Same, for images and other binary references.
 * @returns {{ body: string, title: string | null }}
 */
export function convert({ raw, title, resolveLink, resolveAsset }) {
  const { data, body } = parseFrontmatter(normalise(raw))

  const heading = firstHeading(body)
  const headingTitle = heading?.text ?? null
  const resolvedTitle =
    (typeof data.title === 'string' && data.title ? data.title : null) ?? headingTitle ?? title

  let out = stripPreamble(body)
  out = heading && sameTitle(heading.text, resolvedTitle) ? removeHeading(out, heading) : out

  out = mapOutsideCode(out, (segment) => rewriteSegment(segment, { resolveLink, resolveAsset }))

  return {
    title: resolvedTitle,
    body: `${out.replace(/\n{3,}/g, '\n\n').trim()}\n`,
  }
}

/** Normalises line endings and strips a UTF-8 BOM. */
function normalise(raw) {
  return raw.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n')
}

function stripFrontmatterBody(body) {
  // `readDocument` keeps the body intact; this only trims the leading blank lines a
  // front-matter block leaves behind.
  return body.replace(/^\n+/, '')
}

/**
 * Finds the first ATX heading, returning its level, text and the index of its line.
 * @param {string} body
 */
function firstHeading(body) {
  const lines = body.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const match = /^(#{1,6})\s+(.*?)\s*#*\s*$/.exec(lines[i])
    if (match) return { level: match[1].length, text: match[2].trim(), line: i }
  }
  return null
}

/** Case- and punctuation-insensitive comparison, so `# API` matches "API". */
function sameTitle(a, b) {
  const normalise_ = (value) =>
    value
      .toLowerCase()
      .replace(/[`*_]/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()
  return normalise_(a) === normalise_(b)
}

/**
 * Removes the heading at `heading.line`, together with any trailing blank lines it
 * left at the top of the document.
 */
function removeHeading(body, heading) {
  const lines = body.split('\n')
  lines.splice(heading.line, 1)
  while (lines[0] !== undefined && lines[0].trim() === '') lines.shift()
  return lines.join('\n')
}

/**
 * Splits a document into fenced-code and non-code runs, applies `transform` only to
 * the latter and joins the result back. Without this, a documentation page that
 * shows an example link would have that example rewritten too.
 */
export function mapOutsideCode(markdown, transform) {
  const lines = markdown.split('\n')
  /** @type {string[]} */
  const output = []
  let fence = null
  let buffer = []

  const flush = () => {
    if (buffer.length) output.push(transform(buffer.join('\n')))
    buffer = []
  }

  for (const line of lines) {
    const marker = /^\s{0,3}(`{3,}|~{3,})/.exec(line)

    if (fence) {
      buffer.push(line)
      if (marker && marker[1].startsWith(fence.char) && marker[1].length >= fence.length) {
        output.push(buffer.join('\n'))
        buffer = []
        fence = null
      }
      continue
    }

    if (marker) {
      flush()
      fence = marker[1]
      buffer.push(line)
      continue
    }

    buffer.push(line)
  }

  if (fence && buffer.length) output.push(buffer.join('\n'))
  else flush()

  return output.join('\n')
}

/**
 * Removes the HTML preamble a package README opens with: a centred logo, a row of
 * badges, and an `<h1 align="center">` title.
 *
 * The site already renders a title, a description and a badge above the body, so
 * repeating them is noise — and the logo is usually a `github.com/…/blob/…` URL, which
 * is not a valid image source.
 *
 * Only the *leading* run is touched, and only when it actually looks like a preamble,
 * so a document that uses HTML later keeps all of it.
 *
 * @param {string} body
 */
export function stripPreamble(body) {
  const lines = body.split('\n')
  let index = 0
  let sawPreamble = false

  // Skip the whitespace in front.
  while (index < lines.length && lines[index].trim() === '') index++

  while (index < lines.length) {
    const line = lines[index].trim()

    if (line === '') {
      index++
      continue
    }

    // An HTML heading: drop it, and keep going only if more HTML follows.
    if (/^<h1\b/i.test(line)) {
      sawPreamble = true
      while (index < lines.length && !/<\/h1>/i.test(lines[index])) index++
      index++
      continue
    }

    // Any other HTML line belongs to the banner only if it opens or closes a block.
    if (/^<(\/?)(p|div|a|img|br|table|tr|td|th|ul|ol|li|span|h[1-6])\b/i.test(line)) {
      sawPreamble = true
      index++
      continue
    }

    break
  }

  if (!sawPreamble) return body

  // Only drop the preamble when something real follows it.
  const rest = lines.slice(index)
  if (!rest.some((line) => line.trim() !== '')) return body

  return rest.join('\n')
}

/**
 * Rewrites inline links and images inside one non-code run.
 * @param {string} segment
 * @param {{ resolveLink?: Function, resolveAsset?: Function }} options
 */
function rewriteSegment(segment, { resolveLink, resolveAsset }) {
  let output = segment.replace(
    /(!?)\[((?:\\.|[^\]\\])*)\]\(([^)\s]+)((?:\s+"[^"]*")?)\)/g,
    (match, bang, label, target, title) => {
      const isAsset = bang === '!'
      const resolver = isAsset ? resolveAsset : resolveLink
      if (!resolver) return match

      // Leave anchors, absolute URLs and site-internal paths alone.
      if (target.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(target)) return match

      const [path, hash] = splitHash(target)
      if (!path) return match

      const rewritten = resolver(path)
      if (!rewritten) return match

      return `${bang}[${label}](${rewritten}${hash ?? ''}${title})`
    },
  )

  // A GitHub `blob` URL is a web page, not an image. `raw.githubusercontent.com` serves
  // the bytes, so rewrite the `src` of an inline `<img>` and keep the `href` as it is.
  output = output.replace(
    /(<img\b[^>]*\bsrc=")([^"]+)(")/gi,
    (_match, prefix, url, suffix) => {
      const raw = url.replace(
        /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)$/,
        'https://raw.githubusercontent.com/$1/$2/$3/$4',
      )
      return `${prefix}${raw}${suffix}`
    },
  )

  return output
}

/** @param {string} target */
function splitHash(target) {
  const index = target.indexOf('#')
  if (index === -1) return [target, '']
  return [target.slice(0, index), target.slice(index)]
}

/**
 * Resolves a link written relative to `fromFile` inside `repo` to a repository
 * relative path.
 *
 * @param {string} fromFile The file the link was found in.
 * @param {string} target The link as written.
 * @returns {string | null}
 */
export function resolveRelative(fromFile, target) {
  if (!target || target.startsWith('/')) return null
  if (target.includes('://')) return null

  const decoded = safeDecode(target)
  const base = fromFile.split('/').slice(0, -1)

  const segments = [...base]
  for (const part of decoded.split('/')) {
    if (part === '' || part === '.') continue
    if (part === '..') segments.pop()
    else segments.push(part)
  }

  return segments.join('/') || null
}

function safeDecode(value) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

/**
 * Escapes a value so it can be used inside a Markdown table cell.
 * @param {unknown} value
 */
export function cell(value) {
  if (value === null || value === undefined || value === '') return '—'
  if (value === true) return 'yes'
  if (value === false) return 'no'
  return String(value).replace(/\|/g, '\\|').replace(/\r?\n/g, ' ')
}

/**
 * Renders a dependency map as an inline list.
 *
 * Inline rather than a table on purpose: these values are read inside a table cell
 * of the generated package card, and a nested table is not valid Markdown.
 *
 * @param {Record<string, string>} rows
 */
export function dependencyList(rows) {
  const entries = Object.entries(rows).filter(
    ([, range]) => range && !/^(workspace|link|file|catalog):/.test(range),
  )
  if (!entries.length) return '_none_'

  return entries
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, range]) => `\`${name}\` \`${range}\``)
    .join(' · ')
}