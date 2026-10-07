import { readFile, writeFile } from 'fs/promises'

/**
 * Small plugin to generate a summary.md file for GitBook based on the TypeDoc navigation
 * Reads docs/summary-template.md and replaces the <!-- API PAGES --> placeholder
 */

/** @param {import('typedoc-plugin-markdown').MarkdownApplication} app */
export function load(app) {
  app.renderer.postRenderAsyncJobs.push(async output => {
    if (!output.navigation) {
      app.logger.warn('No navigation found, skipping SUMMARY.md generation')
      return
    }

    /** @returns {string[]} */
    function getLines(
      /** @type {import("typedoc-plugin-markdown").NavigationJSON} */ items
    ) {
      return items.flatMap(item => {
        const childLines = getLines(item.children ?? [])
        if (childLines.length === 0 && !item.path) return []
        return [
          item.path
            ? `- [${item.title}](api/${item.path.replace(/\\/g, '/')})`
            : `- ${item.title}`,
          ...childLines.map(line => `  ${line}`),
        ]
      })
    }

    const lines = getLines(output.navigation).join('\n')

    const file = await readFile('./docs/summary-template.md', 'utf8')
    await writeFile(
      './docs/summary.md',
      file.replace('<!-- API PAGES -->', lines),
      'utf8'
    )
  })
}
