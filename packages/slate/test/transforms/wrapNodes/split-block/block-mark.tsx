/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block old>
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
  Transforms.wrapNodes(editor, <block new />, { split: true })
}
export const output = (
  <editor>
    <block old>one</block>
    <block new>
      <block old>
        <text bold>
          <anchor />
          two
          <focus />
        </text>
      </block>
    </block>
    <block old>
      <text>three</text>
    </block>
  </editor>
)
