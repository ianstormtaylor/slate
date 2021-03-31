/** @jsx jsx */
import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>one</block>
  </editor>
)
export const test = editor => {
  return Editor.end(editor, { path: [0, 0], offset: 1 })
}
export const output = { path: [0, 0], offset: 1 }
