import { createEditor, Editor } from 'slate'

export const input = Object.assign(createEditor(), {
  children: [
    { children: [{ text: 'foo-', bold: true }, { text: 'bar_baz qux' }] },
  ],
})

export const test = editor =>
  Editor.before(
    editor,
    { path: [0, 1], offset: 7 },
    { unit: 'word', isWordCharacter: character => /[\w-]/.test(character) }
  )

export const output = { path: [0, 0], offset: 0 }
