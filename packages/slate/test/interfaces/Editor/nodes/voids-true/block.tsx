/** @jsx jsx */
import { Editor, Text } from 'slate'
import { jsx } from '../../../..'

export const input = (
  <editor>
    <block void>one</block>
  </editor>
)
export const test = editor => {
  return Array.from(
    Editor.nodes(editor, { at: [], match: Text.isText, voids: true })
  )
}
export const output = [[<text>one</text>, [0, 0]]]
