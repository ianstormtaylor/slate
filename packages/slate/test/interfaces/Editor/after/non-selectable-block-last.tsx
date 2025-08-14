/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>one</block>
    <block nonSelectable>two</block>
  </editor>
)

export const test = editor => {
  return Editor.after(editor, { path: [0, 0], offset: 3 })
}

export const output = undefined
