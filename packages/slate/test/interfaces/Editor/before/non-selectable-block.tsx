/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>one</block>
    <block nonSelectable>two</block>
    <block>three</block>
  </editor>
)

export const test = editor => {
  return Editor.before(editor, { path: [2, 0], offset: 0 })
}

export const output = { path: [0, 0], offset: 3 }
