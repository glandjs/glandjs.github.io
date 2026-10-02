# Contributing to the Gland documentation

Thanks for helping make Gland easier to understand. This site is the official
documentation for the Gland framework and its packages.

This guide is specific to the **documentation site**. For contributing to the
framework itself, see
[`glandjs/gland`](https://github.com/glandjs/gland/blob/main/docs/CONTRIBUTING.md).

---

## Prerequisites

- **Node.js** `>= 22.12.0` — Astro 7 requires it; see [`.nvmrc`](./.nvmrc)
- **pnpm** `>= 9`
- **Git** — this repository uses [`gix`](https://github.com/m-mdy-m/gix) for its
  git-flow branch model

```bash
corepack enable
pnpm install
pnpm dev
```

The site is then at <http://localhost:4321>.

`pnpm dev` publishes the mirrored documentation first. If the sibling repositories are
checked out next to this one it reads them from disk; otherwise it reads them from
GitHub. See [Mirroring upstream content](#mirroring-upstream-content).

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
| Which documents are mirrored from where | `scripts/docs-sync/config.mjs` |
| The sync itself | `scripts/docs-sync/` |
| Generated versions, sidebar groups, commit pins | `src/data/sync.generated.mjs` — **do not edit** |
| Package descriptions and roles | `src/data/packages.mjs` |

There is no Tailwind config file. Tailwind 4 is configured in CSS, via
`@import "tailwindcss"` and the `@plugin "@astrojs/starlight-tailwind"` directive.

---

## Where things live

```text
scripts/docs-sync/     Publishes the repositories into the site (see below)
src/
├── assets/            Logo and image assets
├── components/        Astro components, incl. Starlight overrides
├── content/docs/      The documentation (.mdx)
│   ├── reference/     Generated — plus index.mdx, the editorial landing page
│   └── changelog/     Generated
├── data/              Sidebar, package metadata, and the generated manifest
├── layouts/           Custom page layouts
└── styles/            global.css — the whole design system
```

Starlight discovers pages from `src/content/docs/`. A file at
`src/content/docs/getting-started/first-steps.mdx` is served at
`/getting-started/first-steps`. Generated pages are `.md` — plain Markdown cannot be
broken by a stray `{` in prose — and are gitignored, because
[Mirroring upstream content](#mirroring-upstream-content) produces them.

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
Fundamentals → Packages → Guides → From the repositories → Changelog → Resources.

**Mirrored pages need no sidebar entry.** A page under `/reference` or `/changelog`
navigates itself: its group comes from `sidebar` in `scripts/docs-sync/config.mjs`.

---

## Mirroring upstream content

**Nothing under `/reference` or `/changelog` is written by hand.** Those pages are
generated on every build from the documentation that lives in the Gland repositories,
so the site cannot disagree with the code. If something there is wrong, fix it in the
repository that owns it.

### Adding a mirrored page

Add one entry to `scripts/docs-sync/config.mjs`. Nothing else is needed — the page, its
sidebar link and its cross-links are all produced by the build.

```js
{
  id: 'http',
  label: '@glandjs/http',
  repo: 'glandjs/http',
  ref: 'main',
  workspace: 'http',                       // ../http for a local checkout
  packages: [{ from: 'packages/http/package.json' }],
  docs: [
    {
      from: 'docs/guides/cors.md',        // where the file is in the repository
      route: 'guides/cors',               // where it lands: /reference/http/guides/cors
      title: 'CORS',
      description: 'One policy, one implementation, five adapters.',
      sidebar: { label: 'CORS', group: 'Guides', order: 9 },
    },
  ],
  changelog: { from: 'docs/CHANGELOG.md', changesets: '.changeset' },
}
```

| Key | Notes |
| --- | --- |
| `id` | Cache key, changelog route and sidebar group. |
| `repo` | `owner/name` on GitHub. |
| `ref` | Branch or tag. All sources are read from `main`, the canonical published state — never from a feature branch. |
| `workspace` | Folder expected **next to this repository**. When it exists it wins, so a change is published before it is pushed. |
| `packages` | Manifests read for versions, dependencies and engines. Use every `packages/*/package.json` for a monorepo. |
| `docs[].from` | Repository-relative path of the file to mirror. |
| `docs[].route` | Site route below `/reference/<id>`. |
| `docs[].optional` | `true` skips the page instead of failing when the file is not there yet. |
| `docs[].package` | Manifest of the single package a page documents, in a monorepo. Defaults to the repository's first package. |
| `docs[].sidebar` | `{ label, group, order }`. `group` nests the page under a sub-heading. |
| `changelog.changesets` | Set for changeset-driven repositories; pending changesets are published under **Unreleased**. |

### What the sync does

| Step | Behaviour |
| --- | --- |
| Resolve | A sibling checkout wins; otherwise the file is read from `raw.githubusercontent.com` at a pinned commit. |
| Convert | The document's own `# Title` becomes page front matter and is dropped from the body. |
| Link | A link to another mirrored document becomes a site link; anything else relative becomes a link into the repository. So a guide never leads to a 404. |
| Decorate | Install tabs and a package table are added from the manifest, and a banner records the exact commit the page came from. |
| Publish | Written to `src/content/docs/**` before Astro starts, then removed on the next run if the config no longer produces them. |

Versions are read from each repository's `package.json`, not inferred from the
changelog. They can legitimately disagree — `@glandjs/emitter` is published as `1.1.4`
while its newest changelog entry is `1.1.2` — and the site reports each number from the
source that owns it rather than reconciling them.

### Running it

```bash
pnpm docs:sync          # sibling checkouts when they exist, GitHub otherwise
pnpm docs:sync:remote   # always GitHub
pnpm docs:sync:watch    # re-publish whenever a checkout changes
pnpm docs:check         # fail if a declared source is missing or unreadable
```

`dev` and `build` run the sync first. `GLAND_DOCS_SOURCE` forces `local` (and fails when
a checkout is missing), `remote` or `auto`; `GITHUB_TOKEN` raises the API rate limit.

### Where generated output goes

| Path | In git? |
| --- | --- |
| `src/content/docs/reference/**` | no — except `index.mdx`, the editorial landing page |
| `src/content/docs/changelog/**` | no |
| `src/data/sync.generated.mjs` | **yes** — small, and the sidebar imports it |
| `node_modules/.cache/gland-docs/` | no — HTTP cache and the last-run file list |

`sync.generated.mjs` is committed so `astro.config.mjs` can always resolve its import,
and it is rewritten on every build so the versions it carries are never stale.

### Rules when mirroring

Keep the upstream wording. Never invent release notes, and never edit a generated page
by hand — a change there is overwritten on the next build. If a version is missing
upstream, say so rather than reconstructing it. If a document upstream is wrong, fix it
in that repository: the "Edit this page" link on every mirrored page points at the
upstream file.

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
pnpm docs:check  # every declared upstream document resolves
pnpm build       # must succeed
pnpm check       # astro check — types and templates
```

Then:

- Follow the [pull request template](./.github/PULL_REQUEST_TEMPLATE.md).
- Reference the issue it closes (`Closes #123`).
- For a new hand-written page, add it to the sidebar and to `psx.yml`.
- For a mirrored page, add it to `scripts/docs-sync/config.mjs` instead — the sidebar
  follows from it.
- If you touched the design system, check both light and dark themes.
- If you touched the sync script, run it twice: the second run must not rewrite a page
  you did not intend to change.

---

## Code of conduct

Please read and follow the
[Code of Conduct](./CODE_OF_CONDUCT.md). Violations will not be tolerated; report
issues to bitsgenix@gmail.com.

---

## Community

- **Discord** — <https://discord.gg/glandjs>
- **Issues** — <https://github.com/glandjs/glandjs.github.io/issues>
