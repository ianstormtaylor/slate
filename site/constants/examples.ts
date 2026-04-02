export const EXAMPLE_NAMES_AND_PATHS = [
  ['Android Tests', 'android-tests'],
  ['Checklists', 'check-lists'],
  ['Code Highlighting', 'code-highlighting'],
  ['Custom Placeholder', 'custom-placeholder'],
  ['Editable Voids', 'editable-voids'],
  ['Embeds', 'embeds'],
  ['Forced Layout', 'forced-layout'],
  ['Hovering Toolbar', 'hovering-toolbar'],
  ['Huge Document', 'huge-document'],
  ['Images', 'images'],
  ['Inlines', 'inlines'],
  ['Markdown Preview', 'markdown-preview'],
  ['Markdown Shortcuts', 'markdown-shortcuts'],
  ['Mentions', 'mentions'],
  ['Paste HTML', 'paste-html'],
  ['Plain Text', 'plaintext'],
  ['Read-only', 'read-only'],
  ['Rendering in iframes', 'iframe'],
  ['Rich Text', 'richtext'],
  ['Search Highlighting', 'search-highlighting'],
  ['Shadow DOM', 'shadow-dom'],
  ['Styling', 'styling'],
  ['Tables', 'tables'],
] as const

export const HIDDEN_EXAMPLES = ['android-tests'] as const

export const NON_HIDDEN_EXAMPLES = EXAMPLE_NAMES_AND_PATHS.filter(
  ([, path]) => !HIDDEN_EXAMPLES.includes(path as any)
)
