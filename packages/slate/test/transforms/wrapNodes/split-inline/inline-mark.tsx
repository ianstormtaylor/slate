/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      <text>
        one
        <anchor />
      </text>
      <text bold>two</text>
      <text>
        <focus />
        three
      </text>
    </block>
  </editor>
)
export const run = editor => {
  Transforms.wrapNodes(editor, <inline new />, { split: true })
}
export const output = (
  <editor>
    <block>
      <text>one</text>
      <inline new>
        <text bold>
          <anchor />
          two
          <focus />
        </text>
      </inline>
      <text>three</text>
    </block>
  </editor>
)
