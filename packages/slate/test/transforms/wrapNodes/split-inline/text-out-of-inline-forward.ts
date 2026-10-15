import { Transforms, Text } from 'slate'
import { jsx } from '../../..'

export const input = jsx(
  'editor',
  {},
  ...[
    {
      children: [
        { text: '' },
        { inline: true, children: [{ text: 'Tobe' }] },
        { text: 'or  not to be' },
      ],
    },
  ]
)
input.selection = {
  anchor: { path: [0, 1, 0], offset: 2 },
  focus: { path: [0, 2], offset: 3 },
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
  ...[
    {
      children: [
        { text: '' },
        { inline: true, children: [{ text: 'To' }] },
        { text: '' },
        {
          inline: true,
          a: true,
          children: [
            { text: '' },
            { inline: true, children: [{ text: 'be' }] },
            { text: 'or ' },
          ],
        },
        { text: ' not to be' },
      ],
    },
  ]
)
output.selection = {
  anchor: { path: [0, 3, 1, 0], offset: 0 },
  focus: { path: [0, 3, 2], offset: 3 },
}
