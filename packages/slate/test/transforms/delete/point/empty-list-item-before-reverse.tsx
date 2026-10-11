/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.delete(editor, { reverse: true })
}
export const input = (
  <editor>
    <block type="list">
      <block type="item">one</block>
      <block type="item">
        <text />
      </block>
    </block>
    <block type="paragraph">
      <cursor />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block type="list">
      <block type="item">one</block>
      <block type="item">
        <cursor />
      </block>
    </block>
  </editor>
)
