import { Transforms, Text } from 'slate'
import { jsx } from '../../..'

export const input = jsx(
  'editor',
  {},
  ...[
    {
      children: [
        { text: 'ab' },
        { inline: true, void: true, children: [{ text: '' }] },
        { text: 'cd' },
      ],
    },
  ]
)
input.selection = {
  anchor: { path: [0, 0], offset: 1 },
  focus: { path: [0, 2], offset: 1 },
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
        { text: 'a' },
        {
          inline: true,
          a: true,
          children: [
            { text: 'b' },
            { inline: true, void: true, children: [{ text: '' }] },
            { text: 'c' },
          ],
        },
        { text: 'd' },
      ],
    },
  ]
)
output.selection = {
  anchor: { path: [0, 1, 0], offset: 0 },
  focus: { path: [0, 1, 2], offset: 1 },
}
