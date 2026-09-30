# Contributing to the Gland documentation

Thanks for helping make Gland easier to understand. This site is the official
documentation for the Gland framework and its packages.

This guide is specific to the **documentation site**. For contributing to the
framework itself, see
[`glandjs/gland`](https://github.com/glandjs/gland/blob/main/docs/CONTRIBUTING.md).

---

## Prerequisites

- **Node.js** `>= 20.9.0` — see [`.nvmrc`](./.nvmrc)
- **pnpm** `>= 9`
- **Git** — this repository uses [`gix`](https://github.com/m-mdy-m/gix) for its
  git-flow branch model

```bash
corepack enable
pnpm install
pnpm dev
```

The site is then at <http://localhost:4321>.

---

## Table of contents

- [How the site is built](#how-the-site-is-built)
- [Where things live](#where-things-live)
- [Writing documentation](#writing-documentation)
- [Frontmatter reference](#frontmatter-reference)
- [Adding a page to the sidebar](#adding-a-page-to-the-sidebar)
- [Mirroring upstream content](#mirroring-upstream-content)
- [Commit message format](#commit-message-format)
- [Branch workflow](#branch-workflow)
- [Before you open a pull request](#before-you-open-a-pull-request)
- [Code of conduct](#code-of-conduct)

---

## How the site is built

[Astro](https://astro.build) with
[Starlight](https://starlight.astro.build) and Tailwind CSS 4.

| Concern | Where |
| --- | --- |
| Site config, sidebar, components, Expressive Code | `astro.config.mjs` |
| Expressive Code plugins | `ec.config.mjs` |
| Design tokens, light/dark theme, component CSS | `src/styles/global.css` |
| Content schema | `src/content.config.ts` |
| Sidebar order | `src/data/sidebar.mjs` |
| Package metadata for the overview grids | `src/data/packages.mjs` |

There is no Tailwind config file. Tailwind 4 is configured in CSS, via
`@import "tailwindcss"` and the `@plugin "@astrojs/starlight-tailwind"` directive.

---

## Where things live

```text
src/
├── assets/            Logo and image assets
├── components/        Astro components, incl. Starlight overrides
├── content/docs/      The documentation itself (.mdx)
├── data/              Sidebar and package metadata
├── layouts/           Custom page layouts
└── styles/            global.css — the whole design system
```

Starlight discovers pages from `src/content/docs/`. A file at
`src/content/docs/getting-started/first-steps.mdx` is served at
`/getting-started/first-steps`.

---

## Writing documentation

Pages are MDX, so you can use regular Markdown plus Starlight components.

### Callouts

```mdx
<Aside type="note" title="Optional title">
Body text.
</Aside>
```

`type` is one of `note`, `tip`, `caution`, `danger`, or omit it for a plain aside.

<Aside type="tip" title="Pick the right tone">
  Use `caution` for "this will break at runtime" and `note` for context. Overusing
  `caution` trains readers to ignore it.
</Aside>

### Steps

```mdx
<Steps>

1. **First thing to do.**

2. **Second thing to do.**

</Steps>
```

### Package-manager tabs

Always use tabs for install commands, so the snippet is correct for everyone.

```mdx
<Tabs syncKey="pkg">

<TabItem label="pnpm">

```bash
pnpm add @glandjs/core
```

</TabItem>
<TabItem label="npm">

```bash
npm install @glandjs/core
```

</TabItem>

</Tabs>
```

### Code blocks

Give code samples a `title` so the reader knows what file to create, and use
`ins={…}` to highlight the lines that matter.

````mdx
```ts title="src/main.ts" ins={3}
const app = await GlandFactory.create(AppModule)
```
````

### Linking

- **Internal** — `[Modules](/fundamentals/modules)`. Use the absolute path.
- **External** — `[the emitter](https://github.com/glandjs/emitter)`.
- **To a heading** — `[the cache](/packages/emitter#listener-cache)`.

---

## Frontmatter reference

```yaml
---
title: Modules
description: Modules are Gland's composition boundaries.
badge: '@glandjs/core@1.0.3-beta'   # optional label above the title
template: splash                     # only for landing pages
---
```

| Key | Required | Notes |
| --- | --- | --- |
| `title` | yes | The page heading and sidebar label. |
| `description` | yes | Used for SEO and the page subtitle. |
| `badge` | no | Rendered as a pill above the title. Use it for package pages. |
| `template` | no | `splash` for landing pages without a sidebar. |
| `layout` | no | A layout in `src/layouts/`, for custom landing pages. |
| `sidebar` | no | Starlight's own overrides. Prefer `src/data/sidebar.mjs`. |
| `editUrl` | no | Override the edit link for a single page. |

---

## Adding a page to the sidebar

A page that is not in `src/data/sidebar.mjs` is still built, but it will not be
reachable from the navigation. Add it, in reading order:

```js
{
  label: 'Fundamentals',
  collapsed: false,
  items: [
    // …
    { label: 'Modules', link: '/fundamentals/modules' },
  ],
}
```

Keep the group order matching the learning path: Introduction → Getting Started →
Fundamentals → Packages → Guides → Changelog → Resources.

---

## Mirroring upstream content

Package changelogs and API references are **mirrored from the source repositories**,
not written by hand. If you change one, change the source first.

All sources are read from the **`main`** branch, which is the canonical, published
state of each repository. Do not mirror from a feature or integration branch.

| Page | Upstream source |
| --- | --- |
| `/changelog/emitter` | `glandjs/emitter` → `main:docs/CHANGELOG.md` |
| `/changelog/events` | `glandjs/events` → `main:docs/CHANGELOG.md` |
| `/changelog/gland` | `glandjs/gland` → `main:docs/CHANGELOG.md` |
| `/changelog/http` | `glandjs/http` → `main:docs/CHANGELOG.md` |
| `/packages/emitter` | `glandjs/emitter` → `main:docs/API.md` |
| `/packages/core`, `/packages/common` | `glandjs/gland` → `main:packages/*/README.md` |
| `/packages/http`, `/packages/express` | `glandjs/http` → `main:packages/*/README.md` |

Versions are read from each repository's `package.json`, not inferred from the
changelog. They can disagree — `@glandjs/emitter` is published as `1.1.4` while its
newest changelog entry is `1.1.2`. Where that happens, the page says so rather than
reconciling it.

When mirroring, keep the upstream wording, add a `Source of truth` aside linking to
the file on GitHub, and never invent release notes. If a version is missing upstream,
say so rather than reconstructing it.

---

## Commit message format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

| Type | Use for |
| --- | --- |
| `feat` | A new page, component, or capability |
| `fix` | A broken link, wrong code sample, layout bug |
| `docs` | Wording changes to existing pages |
| `style` | Formatting only |
| `refactor` | Restructuring with no behaviour change |
| `test` | Adding or modifying checks |
| `chore` | Dependency updates, tooling, CI |

```text
feat(guides): add a testing guide
fix(emitter): correct the maxCacheSize default in the API page
docs(core): clarify the onModuleInit ordering caveat
chore(deps): bump astro to 7.3.5
```

Dependabot uses the `chore(deps)` and `chore(ci)` prefixes.

---

## Branch workflow

This repository uses [`gix`](https://github.com/m-mdy-m/gix), configured in
`.gix/config`.

```text
main
 └── develop
      ├── feature/*    → merged back into develop
      ├── bugfix/*     → merged back into develop
      ├── hotfix/*     → merged into main + develop, taggable
      └── release/*    → merged into main + develop, taggable
```

```bash
gix feature start add-testing-guide    # create feature/add-testing-guide
# … work, commit …
gix feature finish                      # merge back into develop

gix status                              # where am I in the flow?
gix list                                # all branches by kind
```

---

## Before you open a pull request

```bash
pnpm build     # must succeed
pnpm check     # astro check — types and templates
```

Then:

- Follow the [pull request template](./.github/PULL_REQUEST_TEMPLATE.md).
- Reference the issue it closes (`Closes #123`).
- For a new page, add it to the sidebar and to `psx.yml`.
- If you touched the design system, check both light and dark themes.
- If you mirrored upstream content, link the source file.

---

## Code of conduct

Please read and follow the
[Code of Conduct](./CODE_OF_CONDUCT.md). Violations will not be tolerated; report
issues to bitsgenix@gmail.com.

---

## Community

- **Discord** — <https://discord.gg/glandjs>
- **Issues** — <https://github.com/glandjs/glandjs.github.io/issues>
