/** @jsx jsx */

import assert from 'assert'
import { Transforms, Editor } from 'slate'
import { jsx } from '../..'

export const run = editor => {
  // select all
  Transforms.select(editor, {
    anchor: { path: [0, 0], offset: 0 },
    focus: { path: [0, 0], offset: 5 },
  })
  // remove
  editor.deleteFragment()
}

export const input = (
  <editor>
    <block>Hello</block>
  </editor>
)

export const output = {
  children: [
    {
      children: [
        {
          text: 'Hello',
        },
      ],
    },
  ],
  selection: {
    anchor: { path: [0, 0], offset: 0 },
    focus: { path: [0, 0], offset: 5 },
  },
}

