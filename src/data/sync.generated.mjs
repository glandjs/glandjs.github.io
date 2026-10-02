/**
 * GENERATED FILE — do not edit.
 *
 * Written by `scripts/docs-sync/index.mjs` from `scripts/docs-sync/config.mjs`
 * and the package manifests in the Gland repositories. Run `pnpm docs:sync`
 * (or any build) to refresh it.
 */

/** Repository id -> the commit the mirrored pages were generated from. */
export const commits = {
  "emitter": "f35a8bd02ff3cf61cff06e18c9298620e8adb305",
  "events": "e5e709beaf8ab4ff9bb772af1f4a9d43a3d6acfe",
  "http": "9df20716b813d23d36d52c465f5c97f5dbbd0c3d",
  "core": "e11ffbfe62817c5f71b901e4dbd56e72bb24e344"
}

/** npm package name -> the version its repository currently declares. */
export const versions = {
  "@glandjs/emitter": "1.1.4",
  "@glandjs/events": "2.0.0",
  "@glandjs/http": "1.1.0-beta",
  "@glandjs/express": "1.1.0-beta",
  "@glandjs/fastify": "1.1.0-beta",
  "@glandjs/koa": "1.1.0-beta",
  "@glandjs/hono": "1.1.0-beta",
  "@glandjs/node": "1.1.0-beta",
  "@glandjs/core": "1.0.3-beta",
  "@glandjs/common": "1.0.3-beta"
}

/** Repository id -> the labels and routes of its mirrored pages. */
export const mirrors = {
  "emitter": {
    "repo": "glandjs/emitter",
    "ref": "main",
    "packages": [
      "@glandjs/emitter"
    ],
    "pages": [
      {
        "route": "index",
        "title": "@glandjs/emitter reference"
      },
      {
        "route": "api",
        "title": "API reference"
      }
    ]
  },
  "events": {
    "repo": "glandjs/events",
    "ref": "main",
    "packages": [
      "@glandjs/events"
    ],
    "pages": [
      {
        "route": "index",
        "title": "@glandjs/events reference"
      },
      {
        "route": "quick-start",
        "title": "Quick start"
      },
      {
        "route": "api",
        "title": "API reference"
      }
    ]
  },
  "http": {
    "repo": "glandjs/http",
    "ref": "main",
    "packages": [
      "@glandjs/http",
      "@glandjs/express",
      "@glandjs/fastify",
      "@glandjs/koa",
      "@glandjs/hono",
      "@glandjs/node"
    ],
    "pages": [
      {
        "route": "index",
        "title": "HTTP layer"
      },
      {
        "route": "guides/getting-started",
        "title": "Getting started"
      },
      {
        "route": "guides/adapters",
        "title": "Choosing an adapter"
      },
      {
        "route": "guides/controllers",
        "title": "Controllers and routes"
      },
      {
        "route": "guides/context",
        "title": "The context"
      },
      {
        "route": "guides/middleware",
        "title": "Middleware"
      },
      {
        "route": "guides/bodies",
        "title": "Bodies and uploads"
      },
      {
        "route": "guides/replies",
        "title": "Replies"
      },
      {
        "route": "guides/errors",
        "title": "Errors"
      },
      {
        "route": "guides/cors",
        "title": "CORS"
      },
      {
        "route": "architecture",
        "title": "Architecture"
      },
      {
        "route": "architecture/adapter-contract",
        "title": "The adapter contract"
      },
      {
        "route": "architecture/request-lifecycle",
        "title": "The request lifecycle"
      },
      {
        "route": "architecture/writing-an-adapter",
        "title": "Writing an adapter"
      },
      {
        "route": "api",
        "title": "API reference"
      },
      {
        "route": "adapter-matrix",
        "title": "Differences between adapters"
      },
      {
        "route": "adapters/express",
        "title": "@glandjs/express"
      },
      {
        "route": "adapters/fastify",
        "title": "@glandjs/fastify"
      },
      {
        "route": "adapters/koa",
        "title": "@glandjs/koa"
      },
      {
        "route": "adapters/hono",
        "title": "@glandjs/hono"
      },
      {
        "route": "adapters/node",
        "title": "@glandjs/node"
      }
    ]
  },
  "core": {
    "repo": "glandjs/gland",
    "ref": "main",
    "packages": [
      "@glandjs/core",
      "@glandjs/core",
      "@glandjs/common"
    ],
    "pages": [
      {
        "route": "index",
        "title": "@glandjs/core & common reference"
      },
      {
        "route": "api",
        "title": "API reference"
      },
      {
        "route": "architecture",
        "title": "Architecture"
      },
      {
        "route": "bootstrap",
        "title": "Bootstrap"
      }
    ]
  }
}

/** Sidebar groups for everything mirrored from the repositories. */
export const referenceGroups = [
  {
    "label": "@glandjs/http",
    "collapsed": true,
    "items": [
      {
        "label": "Overview",
        "link": "/reference/http"
      },
      {
        "label": "Guides",
        "collapsed": true,
        "items": [
          {
            "label": "Getting started",
            "link": "/reference/http/guides/getting-started"
          },
          {
            "label": "Choosing an adapter",
            "link": "/reference/http/guides/adapters"
          },
          {
            "label": "Controllers and routes",
            "link": "/reference/http/guides/controllers"
          },
          {
            "label": "The context",
            "link": "/reference/http/guides/context"
          },
          {
            "label": "Middleware",
            "link": "/reference/http/guides/middleware"
          },
          {
            "label": "Bodies and uploads",
            "link": "/reference/http/guides/bodies"
          },
          {
            "label": "Replies",
            "link": "/reference/http/guides/replies"
          },
          {
            "label": "Errors",
            "link": "/reference/http/guides/errors"
          },
          {
            "label": "CORS",
            "link": "/reference/http/guides/cors"
          }
        ]
      },
      {
        "label": "Architecture",
        "collapsed": true,
        "items": [
          {
            "label": "Overview",
            "link": "/reference/http/architecture"
          },
          {
            "label": "The adapter contract",
            "link": "/reference/http/architecture/adapter-contract"
          },
          {
            "label": "The request lifecycle",
            "link": "/reference/http/architecture/request-lifecycle"
          },
          {
            "label": "Writing an adapter",
            "link": "/reference/http/architecture/writing-an-adapter"
          }
        ]
      },
      {
        "label": "Reference",
        "collapsed": true,
        "items": [
          {
            "label": "API reference",
            "link": "/reference/http/api"
          },
          {
            "label": "Adapter matrix",
            "link": "/reference/http/adapter-matrix"
          }
        ]
      },
      {
        "label": "Transports",
        "collapsed": true,
        "items": [
          {
            "label": "Express",
            "link": "/reference/http/adapters/express"
          },
          {
            "label": "Fastify",
            "link": "/reference/http/adapters/fastify"
          },
          {
            "label": "Koa",
            "link": "/reference/http/adapters/koa"
          },
          {
            "label": "Hono",
            "link": "/reference/http/adapters/hono"
          },
          {
            "label": "node:http",
            "link": "/reference/http/adapters/node"
          }
        ]
      }
    ]
  },
  {
    "label": "@glandjs/events",
    "collapsed": true,
    "items": [
      {
        "label": "Overview",
        "link": "/reference/events"
      },
      {
        "label": "Quick start",
        "link": "/reference/events/quick-start"
      },
      {
        "label": "API reference",
        "link": "/reference/events/api"
      }
    ]
  },
  {
    "label": "@glandjs/emitter",
    "collapsed": true,
    "items": [
      {
        "label": "Overview",
        "link": "/reference/emitter"
      },
      {
        "label": "API reference",
        "link": "/reference/emitter/api"
      }
    ]
  },
  {
    "label": "@glandjs/core & common",
    "collapsed": true,
    "items": [
      {
        "label": "Overview",
        "link": "/reference/core"
      },
      {
        "label": "API reference",
        "link": "/reference/core/api"
      },
      {
        "label": "Architecture",
        "link": "/reference/core/architecture"
      },
      {
        "label": "Bootstrap",
        "link": "/reference/core/bootstrap"
      }
    ]
  }
]

