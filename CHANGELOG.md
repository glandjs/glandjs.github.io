# Changelog

All notable changes to the **Gland documentation site** are documented here. The site
follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

For the framework itself, see the per-package changelogs on the site:

- [`@glandjs/emitter`](https://glandjs.github.io/changelog/emitter/)
- [`@glandjs/events`](https://glandjs.github.io/changelog/events/)
- [`@glandjs/core` & `@glandjs/common`](https://glandjs.github.io/changelog/gland/)
- [`@glandjs/http` & `@glandjs/express`](https://glandjs.github.io/changelog/http/)

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
