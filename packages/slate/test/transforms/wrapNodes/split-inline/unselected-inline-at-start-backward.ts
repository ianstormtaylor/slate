import { Transforms, Text } from 'slate'
import { jsx } from '../../..'

export const input = jsx(
  'editor',
  {},
  {
    children: [
      { text: 'before ' },
      { inline: true, children: [{ text: 'Tobe' }] },
      { text: 'or after' },
    ],
  }
)
input.selection = {
  anchor: { path: [0, 2], offset: 3 },
  focus: { path: [0, 1, 0], offset: 4 },
}

export const run = editor => {
  Transforms.wrapNodes(
    editor,
    { inline: true, a: true, children: [] },
    { split: true, match: Text.isText }
  )
}

export const output = jsx(
  'editor',
  {},
  {
    children: [
      { text: 'before ' },
      { inline: true, children: [{ text: 'Tobe' }] },
      { text: '' },
      { inline: true, a: true, children: [{ text: 'or ' }] },
      { text: 'after' },
    ],
  }
)
output.selection = {
  anchor: { path: [0, 3, 0], offset: 3 },
  focus: { path: [0, 3, 0], offset: 0 },
}
