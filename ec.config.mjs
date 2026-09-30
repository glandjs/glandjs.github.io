import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers'
import { pluginTextMarkers } from '@expressive-code/plugin-text-markers'
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections'

/** @type {import('@astrojs/starlight/expressive-code').StarlightExpressiveCodeOptions} */
export default {
  plugins: [
    // `// [!code highlight]` / `// [!code --]` / `// [!code focus]` markers.
    pluginTextMarkers(),
    // `<details>` blocks inside code samples become collapsible sections.
    pluginCollapsibleSections(),
    // Line numbers, off by default — enable per block with `ins={5}`.
    pluginLineNumbers(),
  ],
}
