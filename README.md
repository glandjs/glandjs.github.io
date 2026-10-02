<p align="center">
  <a href="https://glandjs.github.io" target="_blank"><img src="https://raw.githubusercontent.com/glandjs/glandjs.github.io/main/public/logo.svg" width="120" alt="Gland Logo" /></a>
</p>

<h1 align="center">glandjs.github.io</h1>

<p align="center">The official documentation website for the <a href="https://glandjs.github.io">Gland</a> framework.</p>

---

A progressive, event-driven Node.js framework for building efficient and scalable
server-side applications.

Gland separates business intent from transport mechanics: controllers emit domain
events, channels perform the side effects, and brokers carry the transport. The same
modules then run over HTTP, WebSocket or RPC — only the adapter wiring changes.

## Packages

Versions are read from each repository's `package.json` when this table was last
generated, not typed by hand.

| Package | Version | Description |
| --- | --- | --- |
| [`@glandjs/core`](https://glandjs.github.io/packages/core/) | `1.0.3-beta` | DI container, module bootstrap, lifecycle hooks, `Context` |
| [`@glandjs/common`](https://glandjs.github.io/packages/common/) | `1.0.3-beta` | `@Module`, `@Controller`, `@Channel`, `@On`, `@Inject` |
| [`@glandjs/events`](https://glandjs.github.io/packages/events/) | `2.0.0` | Namespaced event broker, channels, mesh networking |
| [`@glandjs/emitter`](https://glandjs.github.io/packages/emitter/) | `1.1.4` | Zero-dependency emitter — `on`, `off`, `emit` |
| [`@glandjs/http`](https://glandjs.github.io/packages/http/) | `1.1.0-beta` | The framework-agnostic HTTP core |
| [`@glandjs/express`](https://glandjs.github.io/packages/express/) | `1.1.0-beta` | The Express 5 adapter |
| [`@glandjs/fastify`](https://glandjs.github.io/packages/fastify/) | `1.1.0-beta` | The Fastify 5 adapter |
| [`@glandjs/koa`](https://glandjs.github.io/packages/koa/) | `1.1.0-beta` | The Koa 3 adapter |
| [`@glandjs/hono`](https://glandjs.github.io/packages/hono/) | `1.1.0-beta` | The Hono 4 adapter, on Node and the edge |
| [`@glandjs/node`](https://glandjs.github.io/packages/node/) | `1.1.0-beta` | The `node:http` adapter, zero dependencies |

## Quick example

```ts
import { GlandFactory } from '@glandjs/core'
import { ExpressBroker } from '@glandjs/express'
import { AppModule } from './app.module'

const { app, shutdown } = await GlandFactory.create(AppModule)
const http = app.connectTo(ExpressBroker)

http.bodyParser({ json: true })
http.listen(3000)
await http.ready()

process.once('SIGTERM', () => void shutdown('SIGTERM'))
```

```ts
import { Controller } from '@glandjs/common'
import { Get } from '@glandjs/http'

@Controller('products')
export class ProductController {
  @Get()
  async list(ctx) {
    return ctx.send({ products: await ctx.call('db:product:all', {}) })
  }
}
```

```ts
import { Channel, On } from '@glandjs/common'

@Channel('db')
export class Database {
  private products = new Map()

  @On('product:all')
  all() {
    return Array.from(this.products.values())
  }
}
```

## This repository

The documentation site. Built with
[Astro](https://astro.build),
[Starlight](https://starlight.astro.build) and Tailwind CSS 4.

```bash
corepack enable
pnpm install
pnpm dev      # http://localhost:4321
```

| Script | Does |
| --- | --- |
| `pnpm dev` | Sync the repositories, then start the dev server |
| `pnpm build` | Sync the repositories, then build to `dist/` |
| `pnpm preview` | Serve the production build |
| `pnpm check` | `astro check` — types and templates |
| `pnpm docs:sync` | Republish the mirrored documentation without building |
| `pnpm docs:sync:watch` | Republish whenever a sibling checkout changes |
| `pnpm docs:check` | Fail if a declared upstream document cannot be read |

### Documentation is generated from the repositories

Everything under `/reference` and `/changelog` is produced at build time from the
`docs/` folder of each Gland repository — the API references, the HTTP guides, the
adapter matrix, the changelogs and the pending changesets. A JSDoc block or a guide is
written in the package it documents, and the site republishes it. Nothing is copied by
hand, so nothing can drift.

```text
scripts/docs-sync/
├── config.mjs        which repository, which file, which route — the only file to edit
├── index.mjs         the CLI: read, convert, write, prune
└── lib/
    ├── sources.mjs   sibling checkout or raw.githubusercontent.com, with a cache
    ├── markdown.mjs  front matter, headings, links
    ├── pages.mjs     the page templates
    ├── changesets.mjs  pending releases, published as "Unreleased"
    ├── sidebar.mjs   derives the navigation from the config
    └── frontmatter.mjs  a small YAML reader/writer
```

Publish a new document by adding one entry to `scripts/docs-sync/config.mjs`. Add a
sibling checkout next to this repository and it is read from disk, so a change is
documented before it is pushed; otherwise it is read from GitHub at a pinned commit.
See [CONTRIBUTING.md](./CONTRIBUTING.md#mirroring-upstream-content).

### Structure

```text
scripts/docs-sync/     Publishes the repositories into the site
src/
├── assets/          Logo and images
├── components/      Astro components, incl. Starlight overrides
├── content/docs/    The documentation
│   ├── reference/   Generated, plus index.mdx
│   └── changelog/   Generated
├── data/            Sidebar order, package metadata, generated manifest
├── layouts/         Custom page layouts
└── styles/          global.css — the design system
```

### Tooling

- **[psx](https://github.com/m-mdy-m/psx)** — structure and rule validation.
  `psx.yml` is the source of truth for the required layout; `.psx-project.yml` is the
  project identity.
- **[gix](https://github.com/m-mdy-m/gix)** — the git-flow branch model, configured in
  `.gix/config`.
- **Dependabot** — weekly dependency updates, grouped by ecosystem.

```bash
psx check      # validate the project structure
gix status     # where am I in the flow?
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). The most useful contribution is usually a
correction to a code sample or a missing caveat — please
[open an issue](https://github.com/glandjs/glandjs.github.io/issues/new/choose) or a
pull request.

Documentation text for the API references, the HTTP guides and the changelogs is
generated from the source repositories rather than written here. See
[Mirroring upstream content](./CONTRIBUTING.md#mirroring-upstream-content).

## License

[MIT](./LICENSE) © Mahdi
