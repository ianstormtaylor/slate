import { Transforms, Text } from 'slate'
import { jsx } from '../../..'

export const input = jsx(
  'editor',
  {},
  {
    children: [
      { text: 'A' },
      {
        inline: true,
        b: true,
        children: [
          { text: 'BC' },
          { inline: true, c: true, children: [{ text: 'DE' }] },
          { text: 'FG' },
        ],
      },
      { text: 'HI' },
    ],
  }
)
input.selection = {
  anchor: { path: [0, 1, 2], offset: 0 },
  focus: { path: [0, 0], offset: 0 },
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
      { text: '' },
      {
        inline: true,
        a: true,
        children: [
          { text: 'A' },
          {
            inline: true,
            b: true,
            children: [
              { text: 'BC' },
              { inline: true, c: true, children: [{ text: 'DE' }] },
              { text: '' },
            ],
          },
          { text: '' },
        ],
      },
      { text: '' },
      { inline: true, b: true, children: [{ text: 'FG' }] },
      { text: 'HI' },
    ],
  }
)
output.selection = {
  anchor: { path: [0, 1, 1, 2], offset: 0 },
  focus: { path: [0, 1, 0], offset: 0 },
}
