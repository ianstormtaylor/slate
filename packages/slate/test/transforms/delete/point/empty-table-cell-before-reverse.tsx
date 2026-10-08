/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.delete(editor, { reverse: true })
}
export const input = (
  <editor>
    <block type="table">
      <block type="row">
        <block type="cell">a</block>
        <block type="cell">
          <text />
        </block>
      </block>
    </block>
    <block type="paragraph">
      <cursor />
      after
    </block>
  </editor>
)
export const output = (
  <editor>
    <block type="table">
      <block type="row">
        <block type="cell">a</block>
        <block type="cell">
          <cursor />
          after
        </block>
      </block>
    </block>
  </editor>
)
