/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.unwrapNodes(editor, { match: n => n.a === true, split: true })
}
export const input = (
  <editor>
    <block a>
      <block>
        <anchor />
        one
      </block>
      <block>two</block>
      <block>
        <focus />
        three
      </block>
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <anchor />
      one
    </block>
    <block>two</block>
    <block a>
      <block>
        <focus />
        three
      </block>
    </block>
  </editor>
)
