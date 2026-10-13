/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.delete(editor)
}
export const input = (
  <editor>
    <block type="list">
      <block type="item">
        <anchor />
        one
      </block>
    </block>
    <block type="paragraph">
      tw
      <focus />o
    </block>
  </editor>
)
export const output = (
  <editor>
    <block type="list">
      <block type="item">
        <cursor />o
      </block>
    </block>
  </editor>
)
