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

| Package | Version | Description |
| --- | --- | --- |
| [`@glandjs/core`](https://glandjs.github.io/packages/core/) | `1.0.3-beta` | DI container, module bootstrap, lifecycle hooks, `Context` |
| [`@glandjs/common`](https://glandjs.github.io/packages/common/) | `1.0.3-beta` | `@Module`, `@Controller`, `@Channel`, `@On`, `@Inject` |
| [`@glandjs/events`](https://glandjs.github.io/packages/events/) | `1.1.2` | Namespaced event broker, channels, mesh networking |
| [`@glandjs/emitter`](https://glandjs.github.io/packages/emitter/) | `1.1.4` | Zero-dependency emitter — `on`, `off`, `emit` |
| [`@glandjs/http`](https://glandjs.github.io/packages/http/) | `1.0.0-beta` | Route decorators, `HttpContext`, `HttpCore`, `HttpBroker` |
| [`@glandjs/express`](https://glandjs.github.io/packages/express/) | `1.0.0-beta` | The Express 5 adapter |

## Quick example

```ts
import { GlandFactory } from '@glandjs/core'
import { ExpressBroker } from '@glandjs/express'
import { AppModule } from './app.module'

const app = await GlandFactory.create(AppModule)
const server = app.connectTo(ExpressBroker)

server.json()
server.listen(3000)
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
| `pnpm dev` | Start the dev server |
| `pnpm build` | Build to `dist/` |
| `pnpm preview` | Serve the production build |
| `pnpm check` | `astro check` — types and templates |

### Structure

```text
src/
├── assets/          Logo and images
├── components/      Astro components, incl. Starlight overrides
├── content/docs/    The documentation (.mdx)
├── data/            Sidebar order and package metadata
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

Documentation text for the package changelogs and API references is mirrored from the
source repositories rather than written here. See
[Mirroring upstream content](./CONTRIBUTING.md#mirroring-upstream-content).

## License

[MIT](./LICENSE) © Mahdi
