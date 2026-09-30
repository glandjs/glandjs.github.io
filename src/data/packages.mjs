/**
 * The Gland package family, used to render the package overview grids and to
 * keep the install snippets in sync with a single source of truth.
 *
 * Versions reflect what is currently published on npm.
 */
export const packages = [
  {
    name: '@glandjs/core',
    version: '1.0.3-beta',
    role: 'Runtime',
    description:
      'The dependency-injection container, module bootstrap, lifecycle hooks and the Context base class.',
    href: '/packages/core',
    repo: 'https://github.com/glandjs/gland',
  },
  {
    name: '@glandjs/common',
    version: '1.0.3-beta',
    role: 'Decorators',
    description:
      'The decorators and metadata keys that make up the DSL: Module, Controller, Channel, On and Inject.',
    href: '/packages/common',
    repo: 'https://github.com/glandjs/gland',
  },
  {
    name: '@glandjs/events',
    version: '1.1.2',
    role: 'Eventing',
    description:
      'The namespaced event broker: channels, mesh networking, request/response calls and async watchers.',
    href: '/packages/events',
    repo: 'https://github.com/glandjs/events',
  },
  {
    name: '@glandjs/emitter',
    version: '1.1.4',
    role: 'Primitive',
    description:
      'A zero-dependency, tree-routed event emitter with wildcard matching. Three methods, nothing else.',
    href: '/packages/emitter',
    repo: 'https://github.com/glandjs/emitter',
  },
  {
    name: '@glandjs/http',
    version: '1.0.0-beta',
    role: 'Protocol',
    description:
      'The HTTP layer: route decorators, HttpContext, the HttpCore application surface and the HttpBroker.',
    href: '/packages/http',
    repo: 'https://github.com/glandjs/gland',
  },
  {
    name: '@glandjs/express',
    version: '1.0.0-beta',
    role: 'Adapter',
    description:
      'The Express 5 adapter. Wires Gland controllers and channels to a real HTTP server.',
    href: '/packages/express',
    repo: 'https://github.com/glandjs/gland',
  },
]

/** Packages you need for a typical HTTP application. */
export const httpStack = [
  '@glandjs/core',
  '@glandjs/common',
  '@glandjs/events',
  '@glandjs/http',
  '@glandjs/express',
]
