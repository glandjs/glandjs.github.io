/**
 * Documentation sidebar.
 *
 * The order of the groups and the links inside them is intentional: it is the
 * path a reader should take to go from "what is this?" to "ship it".
 * See https://starlight.astro.build/reference/configuration/#sidebar
 *
 * @type {import('@astrojs/starlight').StarlightUserConfig['sidebar']}
 */
export const sidebar = [
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
		label: 'Fundamentals',
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
		label: 'Changelog',
		collapsed: true,
		items: [
			{ label: '@glandjs/emitter', link: '/changelog/emitter' },
			{ label: '@glandjs/events', link: '/changelog/events' },
			{ label: '@glandjs/core & common', link: '/changelog/gland' },
			{ label: '@glandjs/http & express', link: '/changelog/http' },
		],
	},
	{
		label: 'Resources',
		collapsed: true,
		items: [{ label: 'FAQ', link: '/faq' }],
	},
]
