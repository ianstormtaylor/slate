/** @jsx jsx */
import { Transforms } from 'slate'

export const run = (editor) => {
  Transforms.delete(editor)
}
export const input = (
  <editor>
    <block>
      one
      <inline>
        two
        <cursor />
      </inline>
      <text />
    </block>
    <block>
      <text />
      <inline>three</inline>
      four
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      one
      <inline>two</inline>
      <text>
        <cursor />
      </text>
      <inline>three</inline>
      four
    </block>
  </editor>
)
