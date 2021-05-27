/** @jsx jsx */
import { Transforms, Text } from 'slate'
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
  Transforms.mergeNodes(editor, { at: [1, 1], match: Text.isText })
}
export const output = (
  <editor>
    <block>one</block>
    <block>
      <cursor />
    </block>
  </editor>
)
