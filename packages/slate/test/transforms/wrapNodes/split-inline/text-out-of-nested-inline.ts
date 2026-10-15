import { Transforms, Text } from 'slate'
import { jsx } from '../../..'

export const input = jsx(
  'editor',
  {},
  ...[
    {
      children: [
        { text: '' },
        {
          inline: true,
          b: true,
          children: [
            { text: 'A' },
            { inline: true, c: true, children: [{ text: 'Tobe' }] },
            { text: 'or after' },
          ],
        },
        { text: '' },
      ],
    },
  ]
)
input.selection = {
  anchor: { path: [0, 1, 1, 0], offset: 2 },
  focus: { path: [0, 1, 2], offset: 3 },
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
          b: true,
          children: [
            { text: 'A' },
            { inline: true, c: true, children: [{ text: 'To' }] },
            { text: '' },
            {
              inline: true,
              a: true,
              children: [
                { text: '' },
                { inline: true, c: true, children: [{ text: 'be' }] },
                { text: 'or ' },
              ],
            },
            { text: 'after' },
          ],
        },
        { text: '' },
      ],
    },
  ]
)
output.selection = {
  anchor: { path: [0, 1, 3, 1, 0], offset: 0 },
  focus: { path: [0, 1, 3, 2], offset: 3 },
}
