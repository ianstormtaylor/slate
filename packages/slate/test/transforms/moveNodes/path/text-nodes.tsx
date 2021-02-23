/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      <text>bar</text>
      <text>foo</text>
    </block>
    <block>
      <cursor />
      baz
    </block>
  </editor>
)
export const run = editor => {
  Transforms.moveNodes(editor, { at: [0, 0], to: [1, 0] })
}
export const output = (
  <editor>
    <block>
      <text>foo</text>
    </block>
    <block>
      <text>
        bar
        <cursor />
        baz
      </text>
    </block>
  </editor>
)
