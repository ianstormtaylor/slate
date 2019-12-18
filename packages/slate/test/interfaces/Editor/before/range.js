/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>one</block>
    <block>two</block>
  </editor>
)

export const test = editor => {
  return Editor.before(editor, {
    anchor: { path: [0, 0], offset: 1 },
    focus: { path: [0, 1], offset: 2 },
  })
}

export const output = { path: [0, 0], offset: 0 }
