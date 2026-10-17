import { Transforms, Text } from 'slate'
import { jsx } from '../../..'

export const input = jsx(
  'editor',
  {},
  {
    children: [
      { text: 'To be' },
      { inline: true, children: [{ text: 'or not' }] },
      { text: '' },
    ],
  }
)
input.selection = {
  anchor: { path: [0, 1, 0], offset: 0 },
  focus: { path: [0, 0], offset: 3 },
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
      { text: 'To ' },
      { inline: true, a: true, children: [{ text: 'be' }] },
      { text: '' },
      { inline: true, children: [{ text: 'or not' }] },
      { text: '' },
    ],
  }
)
output.selection = {
  anchor: { path: [0, 1, 0], offset: 2 },
  focus: { path: [0, 1, 0], offset: 0 },
}
