/** @jsx jsx */
import { Editor, Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.moveNodes(editor, {
    match: n => Editor.isBlock(editor, n),
    to: [0],
  })
}
export const input = (
  <editor>
    <block>one</block>
    <block>
      two
      <anchor />
    </block>
    <block>
      three
      <focus />
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      two
      <anchor />
    </block>
    <block>
      three
      <focus />
    </block>
    <block>one</block>
  </editor>
)
