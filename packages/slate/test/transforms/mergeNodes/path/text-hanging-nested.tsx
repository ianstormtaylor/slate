/** @jsx jsx */
import { Transforms, Text } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>one</block>
    <block>
      <block>
        <cursor />
        <text />
      </block>
    </block>
  </editor>
)
export const run = editor => {
  Transforms.mergeNodes(editor, { at: [1, 0, 1], match: Text.isText })
}
export const output = (
  <editor>
    <block>one</block>
    <block>
      <block>
        <cursor />
      </block>
    </block>
  </editor>
)
