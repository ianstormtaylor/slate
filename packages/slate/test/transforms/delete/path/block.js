/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>one</block>
    <block>two</block>
  </editor>
)

export const run = editor => {
  Editor.delete(editor, { at: [1] })
}

export const output = (
  <editor>
    <block>one</block>
  </editor>
)
