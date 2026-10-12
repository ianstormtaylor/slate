/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.wrapNodes(editor, <block a />)
}
export const input = (
  <editor>
    <block>
      <anchor />
      one
    </block>
    <block>two</block>
    <block>
      <focus />
      three
    </block>
  </editor>
)
export const output = (
  <editor>
    <block a>
      <block>
        <anchor />
        one
      </block>
      <block>two</block>
    </block>
    <block>
      <focus />
      three
    </block>
  </editor>
)
