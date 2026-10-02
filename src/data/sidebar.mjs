import { referenceGroups, versions } from './sync.generated.mjs'

/**
 * Primary documentation navigation.
 *
 * The reader journey first — understand the model, install it, learn the
 * primitives, then explore packages and production-oriented guides — and the
 * repository mirrors last.
 *
 * `referenceGroups` is written by `pnpm docs:sync` from `scripts/docs-sync/config.mjs`,
 * so a document published from any Gland repository appears here without anyone
 * editing this file.
 *
 * @type {import('@astrojs/starlight').StarlightUserConfig['sidebar']}
 */
export const sidebar = [
  { label: 'Overview', link: '/' },
  {
    label: 'Introduction',
    collapsed: false,
    items: [
      { label: 'What is Gland?', link: '/introduction/what-is-gland' },
      { label: 'Why Gland?', link: '/introduction/why-gland' },
      { label: 'Architecture', link: '/introduction/architecture' },
    ],
  },
  {
    label: 'Getting Started',
    collapsed: false,
    items: [
      { label: 'Installation', link: '/getting-started/installation' },
      { label: 'First steps', link: '/getting-started/first-steps' },
      { label: 'Working with the context', link: '/getting-started/working-with-the-context' },
    ],
  },
  {
    label: 'Core Concepts',
    collapsed: false,
    items: [
      { label: 'Modules', link: '/fundamentals/modules' },
      { label: 'Controllers', link: '/fundamentals/controllers' },
      { label: 'Channels', link: '/fundamentals/channels' },
      { label: 'Dependency injection', link: '/fundamentals/dependency-injection' },
      { label: 'Lifecycle events', link: '/fundamentals/lifecycle-events' },
    ],
  },
  {
    label: 'Packages',
    collapsed: false,
    items: [
      { label: '@glandjs/core', link: '/packages/core' },
      { label: '@glandjs/common', link: '/packages/common' },
      { label: '@glandjs/events', link: '/packages/events' },
      { label: '@glandjs/emitter', link: '/packages/emitter' },
      { label: '@glandjs/http', link: '/packages/http' },
      { label: '@glandjs/express', link: '/packages/express' },
      { label: '@glandjs/fastify', link: '/packages/fastify' },
      { label: '@glandjs/koa', link: '/packages/koa' },
      { label: '@glandjs/hono', link: '/packages/hono' },
      { label: '@glandjs/node', link: '/packages/node' },
    ],
  },
  {
    label: 'Guides',
    collapsed: true,
    items: [
      { label: 'Protocol brokers', link: '/guides/protocol-brokers' },
      { label: 'Testing', link: '/guides/testing' },
      { label: 'Performance', link: '/guides/performance' },
    ],
  },
  {
    label: 'From the repositories',
    collapsed: true,
    items: [
      {
        label: 'What this is',
        link: '/reference',
      },
      ...referenceGroups,
    ],
  },
  {
    label: 'Changelog',
    collapsed: true,
    items: Object.keys(versions).length
      ? [
          { label: '@glandjs/http', link: '/changelog/http' },
          { label: '@glandjs/events', link: '/changelog/events' },
          { label: '@glandjs/emitter', link: '/changelog/emitter' },
          { label: '@glandjs/core & common', link: '/changelog/core' },
        ]
      : [],
  },
  {
    label: 'Resources',
    collapsed: true,
    items: [
      { label: 'Documentation map', link: '/documentation' },
      { label: 'FAQ', link: '/faq' },
    ],
  },
]