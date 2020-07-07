/** @jsx jsx */
import { Editor, Transforms } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>one</block>
    <block>
      <cursor />
      two
    </block>
  </editor>
)
export const run = editor => {
  Transforms.mergeNodes(editor, { match: n => Editor.isBlock(editor, n) })
}
export const output = (
  <editor>
    <block>
      one
      <cursor />
      two
    </block>
  </editor>
)
