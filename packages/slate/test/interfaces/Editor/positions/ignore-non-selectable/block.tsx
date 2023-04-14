/** @jsx jsx */
import { Editor } from 'slate'
import { jsx } from '../../../..'

export const input = (
  <editor>
    <block nonSelectable>one</block>
  </editor>
)
export const test = editor => {
  return Array.from(
    Editor.positions(editor, { at: [], ignoreNonSelectable: true })
  )
}
export const output = []
