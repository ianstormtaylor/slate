/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>one</block>
    <block>
      <block>
        <cursor />
        <text>two</text>
      </block>
    </block>
  </editor>
)
export const run = editor => {
  // Disable normalizing, since otherwise this test passes due to it
  editor.normalizeNode = () => {}
  Transforms.mergeNodes(editor, { at: [1, 0, 1] })
}
export const output = (
  <editor>
    <block>one</block>
    <block>
      <block>
        <text>
          <cursor />
          two
        </text>
      </block>
    </block>
  </editor>
)
