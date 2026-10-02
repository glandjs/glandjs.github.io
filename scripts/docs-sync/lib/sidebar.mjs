/**
 * Turns the sync manifest into sidebar entries.
 *
 * A mirrored page declares where it belongs with
 * `sidebar: { label, group, order }`; this module groups those declarations per
 * repository and renders the Starlight shape. Because the sidebar is derived,
 * publishing a new mirrored document navigates to it without anyone editing
 * `sidebar.mjs`.
 */

/**
 * @param {Array<{ repo: import('../config.mjs').repos[number], pages: Array<{ route: string, title: string, sidebar: any }> }>} manifest
 */
export function referenceSidebar(manifest) {
  return [...manifest]
    .sort((a, b) => (a.repo.sidebar?.order ?? 99) - (b.repo.sidebar?.order ?? 99))
    .map((entry) => {
      const pages = entry.pages
        .filter((page) => page.sidebar !== false)
        .sort((a, b) => (a.sidebar?.order ?? 99) - (b.sidebar?.order ?? 99))

      /** @type {Map<string, any[]>} */
      const groups = new Map()
      /** @type {any[]} */
      const loose = []

      for (const page of pages) {
        const item = {
          label: page.sidebar?.label ?? page.title,
          link: route(entry.repo.id, page.route),
        }
        const group = page.sidebar?.group
        if (!group) {
          loose.push(item)
          continue
        }
        if (!groups.has(group)) groups.set(group, [])
        groups.get(group).push(item)
      }

      const items = [...loose]
      for (const [label, groupItems] of groups) {
        items.push({ label, collapsed: true, items: groupItems })
      }

      return { label: entry.repo.label, collapsed: true, items }
    })
}

/** @param {string} repoId */
function route(repoId, pageRoute) {
  const suffix = pageRoute === 'index' ? '' : `/${pageRoute}`
  return `/reference/${repoId}${suffix}`
}