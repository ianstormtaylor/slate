/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block void>one</block>
    <block void>two</block>
  </editor>
)

export const run = editor => {
  Editor.moveNodes(editor, {
    at: [0, 0],
    to: [1, 0],
    voids: true,
  })
}

export const output = (
  <editor>
    <block void>
      <text />
    </block>
    <block void>onetwo</block>
  </editor>
)
