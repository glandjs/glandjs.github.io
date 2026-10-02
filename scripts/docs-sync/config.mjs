/**
 * Single source of truth for everything the site mirrors from the Gland
 * repositories.
 *
 * Adding a page here is the only step needed to publish a document: the sync
 * script (`scripts/docs-sync/index.mjs`) fetches the file, converts it, writes it
 * into the content collection and rebuilds the sidebar. Nothing is copied by hand.
 *
 * Where the content comes from, in order of preference:
 *   1. a sibling checkout (`../<workspace>`), so local commits are documented
 *      before they are pushed;
 *   2. `https://raw.githubusercontent.com/<repo>/<ref>/<path>`.
 *
 * Every entry is resolved with `GLAND_DOCS_SOURCE=auto|local|remote`.
 *
 * A document that has moved or been deleted upstream is a hard failure under
 * `--check`, because a silent hole in the reference is worse than a red build. Set
 * `optional: true` on a page that is still being written to skip it instead.
 */

/** Site-level paths. All are relative to the repository root. */
export const site = {
  /** Public origin, used to build absolute URLs for mirrored assets. */
  url: 'https://glandjs.github.io',
  /** Starlight content root. Generated pages are written below it. */
  contentDir: 'src/content/docs',
  /** Where the generated "mirrored from the repositories" nav lives. */
  generatedDirs: ['src/content/docs/reference', 'src/content/docs/changelog'],
  /** Machine-readable manifest consumed by the sidebar and the package cards. */
  dataFile: 'src/data/sync.generated.mjs',
  /** Scratch space: HTTP cache, ETags, list of files written last run. */
  cacheDir: 'node_modules/.cache/gland-docs',
}

/**
 * Pages that stay in the hand-written content collection. Generated output is
 * deliberately kept out of the way of these.
 */
export const repos = [
  {
    /** Stable id, used for cache keys, changelog routes and sidebar labels. */
    id: 'emitter',
    /** Human label used in headings and sidebar groups. */
    label: '@glandjs/emitter',
    /** `owner/name` on GitHub. */
    repo: 'glandjs/emitter',
    /** Branch or tag to read. */
    ref: 'main',
    /** Folder expected next to the site root for a local checkout. */
    workspace: 'emitter',
    /** Published packages, and the manifest that describes them. */
    packages: [{ from: 'package.json' }],
    /** Where the sidebar group is mounted. */
    sidebar: { order: 30 },
    docs: [
      {
        from: 'docs/API.md',
        route: 'api',
        title: 'API reference',
        description: 'Every exported symbol, every method and every rule in @glandjs/emitter.',
        sidebar: { label: 'API reference', order: 1 },
      },
    ],
    changelog: { from: 'docs/CHANGELOG.md' },
  },

  {
    id: 'events',
    label: '@glandjs/events',
    repo: 'glandjs/events',
    ref: 'main',
    workspace: 'events',
    packages: [{ from: 'package.json' }],
    sidebar: { order: 20 },
    docs: [
      {
        from: 'docs/Quick_Start.md',
        route: 'quick-start',
        title: 'Quick start',
        description: 'The shortest path from an empty file to a running event broker.',
        sidebar: { label: 'Quick start', order: 1 },
      },
      {
        from: 'docs/api/README.md',
        route: 'api',
        title: 'API reference',
        description: 'Every layer of @glandjs/events, every option and every guarantee.',
        sidebar: { label: 'API reference', order: 2 },
      },
    ],
    changelog: { from: 'docs/CHANGELOG.md' },
  },

  {
    id: 'http',
    label: '@glandjs/http',
    repo: 'glandjs/http',
    ref: 'main',
    workspace: 'http',
    /** A monorepo: the root manifest is private, the packages live in `packages/`. */
    packages: [
      { from: 'packages/http/package.json' },
      { from: 'packages/express/package.json' },
      { from: 'packages/fastify/package.json' },
      { from: 'packages/koa/package.json' },
      { from: 'packages/hono/package.json' },
      { from: 'packages/node/package.json' },
    ],
    sidebar: { order: 10 },
    docs: [
      {
        from: 'docs/README.md',
        route: 'index',
        title: 'HTTP layer',
        description:
          'One framework-agnostic core and a pluggable adapter per server. The map of the mirrored documentation.',
        sidebar: { label: 'Overview', order: 0 },
      },
      {
        from: 'docs/guides/getting-started.md',
        route: 'guides/getting-started',
        title: 'Getting started',
        description: 'A working service, from install to first request.',
        sidebar: { label: 'Getting started', group: 'Guides', order: 1 },
      },
      {
        from: 'docs/guides/adapters.md',
        route: 'guides/adapters',
        title: 'Choosing an adapter',
        description: 'The five transports, and which one to reach for.',
        sidebar: { label: 'Choosing an adapter', group: 'Guides', order: 2 },
      },
      {
        from: 'docs/guides/controllers.md',
        route: 'guides/controllers',
        title: 'Controllers and routes',
        description: 'Declaring routes, every method, the prefix rules.',
        sidebar: { label: 'Controllers and routes', group: 'Guides', order: 3 },
      },
      {
        from: 'docs/guides/context.md',
        route: 'guides/context',
        title: 'The context',
        description: 'HttpContext, member by member.',
        sidebar: { label: 'The context', group: 'Guides', order: 4 },
      },
      {
        from: 'docs/guides/middleware.md',
        route: 'guides/middleware',
        title: 'Middleware',
        description: 'The onion, path scoping, useRaw and the Express caveat.',
        sidebar: { label: 'Middleware', group: 'Guides', order: 5 },
      },
      {
        from: 'docs/guides/bodies.md',
        route: 'guides/bodies',
        title: 'Bodies and uploads',
        description: 'The parsers, the limit and the maxAge trap.',
        sidebar: { label: 'Bodies and uploads', group: 'Guides', order: 6 },
      },
      {
        from: 'docs/guides/replies.md',
        route: 'guides/replies',
        title: 'Replies',
        description: 'What a handler may return, and what goes on the wire.',
        sidebar: { label: 'Replies', group: 'Guides', order: 7 },
      },
      {
        from: 'docs/guides/errors.md',
        route: 'guides/errors',
        title: 'Errors',
        description: 'Problem details, the error handler, what is never leaked.',
        sidebar: { label: 'Errors', group: 'Guides', order: 8 },
      },
      {
        from: 'docs/guides/cors.md',
        route: 'guides/cors',
        title: 'CORS',
        description: 'One policy, one implementation, five adapters.',
        sidebar: { label: 'CORS', group: 'Guides', order: 9 },
      },
      {
        from: 'docs/architecture/README.md',
        route: 'architecture',
        title: 'Architecture',
        description: 'The five ideas the layer is built from.',
        sidebar: { label: 'Overview', group: 'Architecture', order: 1 },
      },
      {
        from: 'docs/architecture/adapter-contract.md',
        route: 'architecture/adapter-contract',
        title: 'The adapter contract',
        description: 'What an adapter implements, and what it does not.',
        sidebar: { label: 'The adapter contract', group: 'Architecture', order: 2 },
      },
      {
        from: 'docs/architecture/request-lifecycle.md',
        route: 'architecture/request-lifecycle',
        title: 'The request lifecycle',
        description: 'What happens, in order, for one request.',
        sidebar: { label: 'The request lifecycle', group: 'Architecture', order: 3 },
      },
      {
        from: 'docs/architecture/writing-an-adapter.md',
        route: 'architecture/writing-an-adapter',
        title: 'Writing an adapter',
        description: 'Building a sixth transport from the contract.',
        sidebar: { label: 'Writing an adapter', group: 'Architecture', order: 4 },
      },
      {
        from: 'docs/api/README.md',
        route: 'api',
        title: 'API reference',
        description: 'Every public export, grouped by package.',
        sidebar: { label: 'API reference', group: 'Reference', order: 1 },
      },
      {
        from: 'docs/api/adapter-matrix.md',
        route: 'adapter-matrix',
        title: 'Differences between adapters',
        description: 'What each transport can and cannot do.',
        sidebar: { label: 'Adapter matrix', group: 'Reference', order: 2 },
      },
      {
        from: 'packages/express/README.md',
        package: 'packages/express/package.json',
        route: 'adapters/express',
        title: '@glandjs/express',
        description: 'The Express 5 transport.',
        sidebar: { label: 'Express', group: 'Transports', order: 1 },
      },
      {
        from: 'packages/fastify/README.md',
        package: 'packages/fastify/package.json',
        route: 'adapters/fastify',
        title: '@glandjs/fastify',
        description: 'The Fastify 5 transport.',
        sidebar: { label: 'Fastify', group: 'Transports', order: 2 },
      },
      {
        from: 'packages/koa/README.md',
        package: 'packages/koa/package.json',
        route: 'adapters/koa',
        title: '@glandjs/koa',
        description: 'The Koa 3 transport.',
        sidebar: { label: 'Koa', group: 'Transports', order: 3 },
      },
      {
        from: 'packages/hono/README.md',
        package: 'packages/hono/package.json',
        route: 'adapters/hono',
        title: '@glandjs/hono',
        description: 'The Hono 4 transport, on Node and on the edge.',
        sidebar: { label: 'Hono', group: 'Transports', order: 4 },
      },
      {
        from: 'packages/node/README.md',
        package: 'packages/node/package.json',
        route: 'adapters/node',
        title: '@glandjs/node',
        description: 'The node:http transport: no framework, no dependencies.',
        sidebar: { label: 'node:http', group: 'Transports', order: 5 },
      },
    ],
    /**
     * The HTTP repo has no hand-written changelog: releases are driven by
     * changesets. The sync script publishes the pending ones as "Unreleased"
     * and falls back to the npm registry once they land.
     */
    changelog: { from: 'docs/CHANGELOG.md', changesets: '.changeset' },
  },

  {
    id: 'core',
    label: '@glandjs/core & common',
    repo: 'glandjs/gland',
    ref: 'main',
    workspace: 'gland',
    packages: [
      { from: 'package.json' },
      { from: 'packages/core/package.json' },
      { from: 'packages/common/package.json' },
    ],
    sidebar: { order: 40 },
    docs: [
      {
        from: 'docs/api/README.md',
        route: 'api',
        title: 'API reference',
        description: 'Every public export of @glandjs/core and @glandjs/common.',
        sidebar: { label: 'API reference', order: 1 },
      },
      {
        from: 'docs/architecture/README.md',
        route: 'architecture',
        title: 'Architecture',
        description: 'The bootstrap sequence and the two event flows.',
        sidebar: { label: 'Architecture', order: 2 },
      },
      {
        from: 'docs/architecture/bootstrap.md',
        route: 'bootstrap',
        title: 'Bootstrap',
        description: 'What GlandFactory.create actually does.',
        sidebar: { label: 'Bootstrap', order: 3 },
      },
    ],
    changelog: { from: 'docs/CHANGELOG.md', changesets: '.changeset' },
  },
]

/**
 * The route prefix every mirrored page lives under. Generated content is namespaced
 * so a reader can always tell a synced document from a hand-written one, and so a
 * path collision is impossible by construction.
 */
export const referenceBase = '/reference'

/** Route prefix for release history, one page per repository. */
export const changelogBase = '/changelog'