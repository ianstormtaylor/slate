/** @jsx jsx */
import assert from 'assert'
import { Transforms } from 'slate'
import { jsx } from '../..'

export const input = (
  <editor>
    <block>
      word
      <cursor />
    </block>
  </editor>
)
export const run = editor => {
  // position 2 is past the end of the block children
  assert.throws(() => {
    Transforms.insertNodes(editor, <text>another</text>, { at: [0, 2] })
  }, 'Inserting a node after the end of a block should fail')
  // 1 is _at_ the end, so it's still valid
  Transforms.insertNodes(editor, <text>another</text>, { at: [0, 1] })
}
export const output = (
  <editor>
    <block>
      word
      <cursor />
      another
    </block>
  </editor>
)
