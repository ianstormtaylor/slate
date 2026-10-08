/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>one</block>
    <block>
      <cursor />
      <text />
    </block>
  </editor>
)
export const run = editor => {
  // Disable normalizing, since otherwise this test passes due to it
  editor.normalizeNode = () => {}
  Transforms.mergeNodes(editor, { at: [1, 1] })
}
export const output = (
  <editor>
    <block>one</block>
    <block>
      <cursor />
    </block>
  </editor>
)
