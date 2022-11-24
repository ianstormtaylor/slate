/** @jsx jsx */

import assert from 'assert'
import { Transforms, Editor } from 'slate'
import { jsx } from '../..'

export const run = editor => {
  // focus at the end
  Transforms.select(editor, {
    anchor: { path: [0, 0], offset: 5 },
    focus: { path: [0, 0], offset: 5 },
  })
  // select all
  Transforms.select(editor, {
    anchor: { path: [0, 0], offset: 5 },
    focus: { path: [0, 0], offset: 0 },
  })
  // remove
  Editor.deleteFragment(editor)
  // blur
  Transforms.deselect(editor)
  // focus back
  Transforms.select(editor, {
    anchor: { path: [0, 0], offset: 0 },
    focus: { path: [0, 0], offset: 0 },
  })
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
    anchor: { path: [0, 0], offset: 5 },
    focus: { path: [0, 0], offset: 0 },
  },
}
