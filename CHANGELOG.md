# Changelog

All notable changes to the **Gland documentation site** are documented here. The site
follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

For the framework itself, see the per-package changelogs on the site — every one of
them is generated from the package repository, so it cannot go stale:

- [`@glandjs/emitter`](https://glandjs.github.io/changelog/emitter/)
- [`@glandjs/events`](https://glandjs.github.io/changelog/events/)
- [`@glandjs/core` & `@glandjs/common`](https://glandjs.github.io/changelog/core/)
- [`@glandjs/http` and the five adapters](https://glandjs.github.io/changelog/http/)

---

## [Unreleased]

### Added

#### Documentation generated from the repositories

The long documentation is no longer written here. `scripts/docs-sync/` reads it out of
the Gland repositories on every build, so a guide, an API reference or a changelog
entry is written **in the package it documents** and republished by the site.

- **Sync engine** — `scripts/docs-sync/`, dependency-free and driven by a single
  `config.mjs`. A sibling checkout next to this repository wins when it exists, so a
  change is documented before it is pushed; otherwise the file is read from
  `raw.githubusercontent.com` at a pinned commit, with an ETag cache.
- **Mirrored reference** — the HTTP guides, architecture documents, API reference,
  adapter matrix and per-adapter READMEs under `/reference`, plus the emitter API
  reference, the events quick start and API reference, and the core API and
  architecture pages.
- **Generated changelogs** — one page per repository under `/changelog`, replacing the
  four hand-written copies. Repositories that release through changesets also get their
  pending changesets published under **Unreleased**, so behaviour that is written but
  not yet shipped is documented as soon as it is written.
- **Derived navigation** — the sidebar groups and every package version come from
  `src/data/sync.generated.mjs`. Adding a document to `config.mjs` publishes it and
  links it; nothing else is touched.
- **`/reference`** — a hand-written landing page explaining where the text comes from
  and how to publish a new document.
- **`scripts/validate-docs.mjs`** — parses every documentation file with the same
  Markdown parser Astro uses and fails on a broken directive or an unparseable page.

#### Packages

- **`@glandjs/fastify`, `@glandjs/koa`, `@glandjs/hono` and `@glandjs/node`** — the
  HTTP layer is no longer Express-only, so the package reference covers all five
  transports and `src/data/packages.mjs` lists all ten packages.

### Changed

- **`@glandjs/http` page rewritten** against the current source: the adapter base class
  is `HttpServerAdapter` (not `HttpAdapterAbstract`), the lifecycle bus is
  `HttpEventBroker` (not `HttpEventCore`), `HttpContext` has the explicit
  request/response header split plus `HttpReply`, `SseStream` and `ctx.throw()`, CORS is
  built in, and `bodyParser` defaults to off. The names that do **not** exist —
  `ctx.header()`, `ctx.code()`, `ctx.body =`, `jsonp()`, `render()` — are listed.
- **`@glandjs/events` page rewritten** against 2.0.0: `send()` carries a payload,
  `ConnectionOptions.events` matches exactly rather than by wildcard, `call()` returns
  `[]` when nothing is listening, `ignoreErrors` governs peer routing rather than an
  `error` event, and extending `EventRecord` in an event map is called out as the trap
  it is.
- **`GlandFactory.create()`** documented as returning `{ app, shutdown }`, which is
  what it has returned for some time; the previous `const app = await
  GlandFactory.create(...)` example did not typecheck.
- **`connectTo(ExpressBroker<EventTypes>)`** replaced with `connectTo(ExpressBroker)`,
  plus `await http.ready()` alongside `listen()`.
- **`ctx.throw()`** options documented as `{ type, title, detail, instance }`, with
  `HttpStatus` imported from `@medishn/toolkit` rather than `@glandjs/http`.
- **Install commands** no longer tell you to add `cors`: CORS is implemented inside
  `@glandjs/http`, and the optional peer dependencies are listed per adapter.

### Fixed

- **Package versions** on the landing grid, the documentation map, the package table
  and the README now come from each repository's `package.json` instead of being typed
  by hand, so `@glandjs/events` reads `2.0.0` and the HTTP packages read `1.1.0-beta`
  without a manual edit.
- **`astro check`** — the hero action icon is cast to `StarlightIcon`; diagnostics are
  clean.
- **Stale links** to `/changelog/gland` replaced with `/changelog/core`, and the
  documentation map is now reachable from the sidebar.

---

## [1.0.0]

### Added

#### Documentation

- **Landing page** — splash hero, install command, and a feature grid covering the six
  properties of the framework.
- **Documentation home** — a curated overview with the "Why Gland?" pillars and a
  package grid generated from `src/data/packages.mjs`.
- **Introduction** — [What is Gland?](src/content/docs/introduction/what-is-gland.mdx),
  [Why Gland?](src/content/docs/introduction/why-gland.mdx) and
  [Architecture](src/content/docs/introduction/architecture.mdx), including the full
  bootstrap sequence and the two event flows.
- **Getting started** — installation with pnpm/npm/yarn tabs, a
  [First steps](src/content/docs/getting-started/first-steps.mdx) walkthrough built on
  the `samples/01-simple` application, and a full guide to
  [Working with the context](src/content/docs/getting-started/working-with-the-context.mdx).
- **Fundamentals** — modules, controllers, channels, dependency injection and
  lifecycle events.
- **Package reference** — one page per published package, each with the exact exported
  surface: `core`, `common`, `events`, `emitter`, `http`, `express`.
- **Guides** — [protocol brokers](src/content/docs/guides/protocol-brokers.mdx) (writing
  your own `BrokerAdapter`), [testing](src/content/docs/guides/testing.mdx) and
  [performance](src/content/docs/guides/performance.mdx).
- **Changelogs** mirrored from the source repositories, with a source-of-truth link on
  each page.
- **FAQ** — migration, testing, delivery-semantics and performance questions.

#### Design

- Rebuilt the visual system on Tailwind CSS 4 with a Starlight theme, giving the site a
  full light and dark palette rather than dark-only.
- Custom top navigation bar with a centred Pagefind search, primary navigation, GitHub
  and Discord links, and the Starlight theme switcher.
- Replaced the joke testimonials section with a substantive "Why Gland?" pillar grid.
- Card, callout, steps, table, pagination and code-frame styling tuned for dense
  technical reading; code samples support titles, line highlighting and a copy button.
- Page title, footer, content panel and package cards as reusable components.

#### Tooling

- **Upgraded** to Astro `7`, Starlight `0.42`, Tailwind CSS `4` (via
  `@tailwindcss/vite`, replacing the deprecated `@astrojs/tailwind` bridge) and
  Expressive Code `0.44` with line-number, text-marker and collapsible-section plugins.
- Self-hosted **Inter** and **JetBrains Mono** via Fontsource, removing the render-
  blocking Google Fonts requests.
- Added `astro check` for type and template validation.
- **Dependabot** for `npm` and GitHub Actions, with dependency groups so a Tailwind
  bump never rides along with an Astro bump.
- **[psx](https://github.com/m-mdy-m/psx)** manifests — `psx.yml` plus
  `.psx-project.yml` — describing the required structure and the rule severities.
- **[gix](https://github.com/m-mdy-m/gix)** flow config in `.gix/config`.
- `.editorconfig`, `.nvmrc`, `CODEOWNERS`, `SECURITY.md` and a documentation-specific
  `CONTRIBUTING.md`.

### Fixed

- Every sidebar link now resolves to a real page. The previous sidebar pointed at
  fifteen pages that did not exist.
- Corrected the documented `@glandjs/emitter` cache default from `6` to `64`.
- Documented that only a fully-qualified event name matches exactly — a parent
  listener is not fired for a child event.
- Documented that wildcards are unavailable in a typed event map.
- Documented that a throwing listener propagates out of `emit` and skips the
  remaining listeners.
- Replaced invented `1.1.3` / `1.1.4` release notes with the real upstream `1.1.5`
  entry.
- Corrected the source of `HttpStatus` to `@medishn/toolkit`; it is not exported by
  `@glandjs/http`.
