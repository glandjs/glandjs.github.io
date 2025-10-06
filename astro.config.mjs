import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import tailwind from '@astrojs/tailwind'

export default defineConfig({
  site: 'https://glandjs.github.io',
  base: '/',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    starlight({
      title: 'Gland',
      social: {
        github: 'https://github.com/glandjs/docs',
        discord: 'https://discord.gg/glandjs',
        npm: 'https://www.npmjs.com/package/@glandjs/core',
      },
      expressiveCode: {
        themes: ['github-dark-default'],
        styleOverrides: {
          borderRadius: '0.5rem',
        },
      },
      customCss: ['@styles/tailwind.css'],
      components: {
        Header: '@components/Header.astro',
        ContentPanel: '@components/ContentPanel.astro',
        PageTitle: '@components/PageTitle.astro',
      },
      head: [
        {
          tag: 'link',
          attrs: {
            rel: 'preconnect',
            href: 'https://fonts.googleapis.com',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'preconnect',
            href: 'https://fonts.gstatic.com',
            crossorigin: 'anonymous',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap',
          },
        },
      ],
      sidebar: [
        {
          label: 'Introduction',
          collapsed: false,
          items: [
            {
              label: 'Quickstart',
              link: '/documentation/quickstart',
            },
          ],
        },
        {
          label: 'Core Concepts',
          collapsed: false,
          items: [
            {
              label: 'Event-Driven Architecture',
              link: '/concepts/event-driven',
            },
            {
              label: 'Channels',
              link: '/concepts/channels',
            },
            {
              label: 'Controllers',
              link: '/concepts/controllers',
            },
            {
              label: 'Modules',
              link: '/concepts/modules',
            },
          ],
        },
        {
          label: 'Guides',
          collapsed: true,
          items: [
            {
              label: 'Basic Usage',
              link: '/guides/basic-usage',
            },
            {
              label: 'Dependency Injection',
              link: '/guides/dependency-injection',
            },
            {
              label: 'Advanced Features',
              link: '/guides/advanced-features',
            },
            {
              label: 'Best Practices',
              link: '/guides/best-practices',
            },
          ],
        },
        {
          label: 'Packages',
          collapsed: false,
          items: [
            {
              label: 'Emitter',
              link: '/packages/emitter',
              badge: 'New',
            },
          ],
        },
        {
          label: 'HTTP Integration',
          collapsed: true,
          items: [
            {
              label: 'Express Integration',
              link: '/http/express',
            },
            {
              label: 'Fastify Integration',
              link: '/http/fastify',
            },
            {
              label: 'Custom Integrations',
              link: '/http/custom',
            },
          ],
        },
        {
          label: 'API Reference',
          collapsed: true,
          items: [
            {
              label: 'Core API',
              link: '/api/core',
            },
            {
              label: 'Utilities',
              link: '/api/utilities',
            },
            {
              label: 'Configuration',
              link: '/api/configuration',
            },
            {
              label: 'Decorators',
              link: '/api/decorators',
            },
          ],
        },
        {
          label: 'Resources',
          collapsed: true,
          items: [
            {
              label: 'FAQ',
              link: '/resources/faq',
            },
            {
              label: 'Examples',
              link: '/resources/examples',
            },
            {
              label: 'Community',
              link: '/resources/community',
            },
            {
              label: 'Contributing',
              link: '/resources/contributing',
            },
          ],
        },
      ],
      lastUpdated: true,
      pagination: true,
    }),
  ],
})
