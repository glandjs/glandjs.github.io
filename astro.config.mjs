// @ts-check
import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import tailwind from '@astrojs/tailwind'

// https://astro.build/config
export default defineConfig({
  site: 'https://glandjs.github.io/docs',
  base: '/docs/',
  integrations: [
    starlight({
      expressiveCode: {
        themes: ['vesper'],
      },
      title: 'Gland',
      social: {
        github: 'https://github.com/glandjs/gland',
      },
      customCss: ['./src/tailwind.css'],
      components: {
        Header: '@components/Header.astro',
        Footer: '@components/Footer.astro',
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
            crossorigin: true,
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
          },
        },
      ],
    }),
    tailwind({ applyBaseStyles: false }),
  ],
})
