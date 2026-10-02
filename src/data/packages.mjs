import { versions } from './sync.generated.mjs'

/**
 * The Gland package family, used to render the package overview grids and to
 * keep the install snippets in sync with a single source of truth.
 *
 * Versions are **not** written here. They are read from `sync.generated.mjs`,
 * which the sync script writes from each repository's `package.json` on every
 * build, so a card can never advertise a version that was never published.
 *
 * `v()` falls back to a placeholder when a package is unknown, which happens only
 * before the first sync has run.
 */
const v = (name) => versions[name] ?? 'next'

export const packages = [
  {
    name: '@glandjs/core',
    version: v('@glandjs/core'),
    role: 'Runtime',
    description:
      'The dependency-injection container, module bootstrap, lifecycle hooks and the Context base class.',
    href: '/packages/core',
    repo: 'https://github.com/glandjs/gland',
  },
  {
    name: '@glandjs/common',
    version: v('@glandjs/common'),
    role: 'Decorators',
    description:
      'The decorators and metadata keys that make up the DSL: Module, Controller, Channel, On and Inject.',
    href: '/packages/common',
    repo: 'https://github.com/glandjs/gland',
  },
  {
    name: '@glandjs/events',
    version: v('@glandjs/events'),
    role: 'Eventing',
    description:
      'The namespaced event broker: channels, mesh networking, request/response calls and async watchers.',
    href: '/packages/events',
    repo: 'https://github.com/glandjs/events',
  },
  {
    name: '@glandjs/emitter',
    version: v('@glandjs/emitter'),
    role: 'Primitive',
    description:
      'A zero-dependency, tree-routed event emitter with wildcard matching. Three methods, nothing else.',
    href: '/packages/emitter',
    repo: 'https://github.com/glandjs/emitter',
  },
  {
    name: '@glandjs/http',
    version: v('@glandjs/http'),
    role: 'Protocol',
    description:
      'The framework-agnostic HTTP core: route decorators, HttpContext, the middleware onion, HttpCore and the HttpBroker.',
    href: '/packages/http',
    repo: 'https://github.com/glandjs/http',
    reference: '/reference/http',
  },
  {
    name: '@glandjs/express',
    version: v('@glandjs/express'),
    role: 'Adapter',
    description:
      'The Express 5 adapter. Wires Gland controllers and channels to a real HTTP server.',
    href: '/packages/express',
    repo: 'https://github.com/glandjs/http',
    reference: '/reference/http/adapters/express',
  },
  {
    name: '@glandjs/fastify',
    version: v('@glandjs/fastify'),
    role: 'Adapter',
    description:
      'The Fastify 5 adapter, with the middleware onion composed into a single real hook.',
    href: '/packages/fastify',
    repo: 'https://github.com/glandjs/http',
    reference: '/reference/http/adapters/fastify',
  },
  {
    name: '@glandjs/koa',
    version: v('@glandjs/koa'),
    role: 'Adapter',
    description:
      'The Koa 3 adapter: a native router, native extended verbs and a real promise onion.',
    href: '/packages/koa',
    repo: 'https://github.com/glandjs/http',
    reference: '/reference/http/adapters/koa',
  },
  {
    name: '@glandjs/hono',
    version: v('@glandjs/hono'),
    role: 'Adapter',
    description:
      'The Hono 4 adapter, running on Node and on the edge through the Fetch API.',
    href: '/packages/hono',
    repo: 'https://github.com/glandjs/http',
    reference: '/reference/http/adapters/hono',
  },
  {
    name: '@glandjs/node',
    version: v('@glandjs/node'),
    role: 'Adapter',
    description:
      'The node:http adapter: the reference implementation of the contract, with no framework and no dependencies.',
    href: '/packages/node',
    repo: 'https://github.com/glandjs/http',
    reference: '/reference/http/adapters/node',
  },
]

/** Packages you need for a typical HTTP application. */
export const httpStack = ['@glandjs/core', '@glandjs/common', '@glandjs/events', '@glandjs/http']