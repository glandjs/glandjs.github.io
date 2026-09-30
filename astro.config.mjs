// @ts-check
import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import tailwindcss from '@tailwindcss/vite'

import { sidebar } from './src/data/sidebar.mjs'

// https://astro.build/config
export default defineConfig({
  site: 'https://glandjs.github.io',
  base: '/',
  trailingSlash: 'ignore',
  build: { format: 'directory' },

  // Client-side navigation with Astro's view transitions.
  integrations: [
    starlight({
      title: 'Gland',
      titleDelimiter: '|',
      description:
        'Gland is a lightweight, event-driven and protocol-agnostic framework for Node.js. Build modular, testable backends with controllers, channels and brokers.',

      logo: {
        src: './src/assets/gland-logo.svg',
        alt: 'Gland',
        replacesTitle: false,
      },
      favicon: '/favicon.svg',

      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/glandjs/glandjs.github.io',
        },
        { icon: 'discord', label: 'Discord', href: 'https://discord.gg/glandjs' },
      ],

      editLink: {
        baseUrl: 'https://github.com/glandjs/glandjs.github.io/edit/main/',
      },

      customCss: ['./src/styles/global.css'],

      components: {
        // Renders Starlight's head plus Astro's <ClientRouter />, so page
        // transitions can be animated.
        Head: '@components/Head.astro',
        // Same component, but with dark as the default colour scheme.
        ThemeProvider: '@components/ThemeProvider.astro',
        Header: '@components/Header.astro',
        Hero: '@components/Hero.astro',
        PageTitle: '@components/PageTitle.astro',
        ContentPanel: '@components/ContentPanel.astro',
        Footer: '@components/Footer.astro',
      },

      expressiveCode: {
        themes: ['github-light', 'github-dark-high-contrast'],
        styleOverrides: {
          borderRadius: '0.65rem',
          codeFontFamily: 'var(--font-mono)',
          codeFontSize: '0.875rem',
          frames: {
            editorActiveTabIndicatorTopColor: 'transparent',
            frameBoxShadowCssValue: 'none',
          },
        },
        defaultProps: { wrap: true },
      },

      head: [
        { tag: 'link', attrs: { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' } },
        // Keep the browser chrome in step with the active theme.
        { tag: 'meta', attrs: { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#080a0d' } },
        { tag: 'meta', attrs: { name: 'theme-color', media: '(prefers-color-scheme: light)', content: '#ffffff' } },
        { tag: 'meta', attrs: { name: 'color-scheme', content: 'dark light' } },
      ],

      lastUpdated: true,
      pagination: true,
      credits: false,
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },

      sidebar,
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
})
