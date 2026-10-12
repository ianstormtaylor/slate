import { Transforms, Text } from 'slate'
import { jsx } from '../../..'

export const input = jsx(
  'editor',
  {},
  ...[
    {
      children: [
        { text: '' },
        { inline: true, children: [{ text: 'one two three' }] },
        { text: '' },
      ],
    },
  ]
)
input.selection = {
  anchor: { path: [0, 1, 0], offset: 4 },
  focus: { path: [0, 1, 0], offset: 7 },
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
        {
          inline: true,
          children: [
            { text: 'one ' },
            { inline: true, a: true, children: [{ text: 'two' }] },
            { text: ' three' },
          ],
        },
        { text: '' },
      ],
    },
  ]
)
output.selection = {
  anchor: { path: [0, 1, 1, 0], offset: 0 },
  focus: { path: [0, 1, 1, 0], offset: 3 },
}
