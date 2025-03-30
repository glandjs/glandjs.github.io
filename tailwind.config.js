/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,ts}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem',
        md: '2rem',
        lg: '4rem',
      },
    },
    extend: {
      colors: {
        primary: 'rgb(var(--primary) / <alpha-value>)',
        'text-primary': 'rgb(var(--text-primary) / <alpha-value>)',
        'text-secondary': 'rgb(var(--text-secondary) / <alpha-value>)',
        header: {
          bg: 'rgb(var(--header-bg) / <alpha-value>)',
          border: 'rgb(var(--header-border) / <alpha-value>)',
        },
        border: 'rgb(var(--border) / <alpha-value>)',
        'text-primary': 'rgb(var(--text-primary) / <alpha-value>)',
        'text-secondary': 'rgb(var(--text-secondary) / <alpha-value>)',
        background: 'rgb(var(--background) / <alpha-value>)',
        'background-secondary':
          'rgb(var(--background-secondary) / <alpha-value>)',
        'background-tertiary':
          'rgb(var(--background-tertiary) / <alpha-value>)',
        'text-tertiary': 'rgb(var(--text-tertiary) / <alpha-value>)',
        green: {
          400: '#4ade80',
          500: '#22c55e',
        },
        blue: {
          400: '#60a5fa',
          500: '#3b82f6',
        },
        purple: {
          400: '#c084fc',
          500: '#a855f7',
        },
        pink: {
          400: '#f472b6',
          500: '#ec4899',
        },
        yellow: {
          400: '#facc15',
          500: '#eab308',
        },
      },
      backdropBlur: {
        header: '12px',
      },
      gridTemplateColumns: {
        footer: '1fr 2fr',
        footerLinks: 'repeat(3, 1fr)',
      },
      boxShadow: {
        feature: '0 0 40px -15px rgba(0, 0, 0, 0.1)',
        'feature-dark': '0 0 40px -15px rgba(255, 255, 255, 0.1)',
      },
      spacing: {
        'container-padding': '1.5rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      fontSize: {
        '6xl': ['3.5rem', { lineHeight: '1.1' }],
      },
      keyframes: {
        'button-hover': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
        'tab-active': {
          '0%': { transform: 'translateY(2px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
      animation: {
        'button-hover': 'button-hover 0.4s ease-in-out',
        'tab-active': 'tab-active 0.3s ease-out',
      },
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
  },
  plugins: [],
}
