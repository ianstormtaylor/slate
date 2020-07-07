/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      <cursor />
      one
    </block>
  </editor>
)
export const run = editor => {
  Transforms.insertNodes(editor, [<block>two</block>, <block>three</block>], {
    at: [0],
  })
}
export const output = (
  <editor>
    <block>two</block>
    <block>three</block>
    <block>
      <cursor />
      one
    </block>
  </editor>
)
