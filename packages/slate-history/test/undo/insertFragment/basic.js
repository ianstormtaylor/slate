/** @jsx h */

import { h } from '../../helpers'

const fragment = (
  <block type="d">
    <block>A</block>
    <block type="c">
      <block type="d">
        <block>B</block>
        <block>
          <block type="d">
            <block>C</block>
          </block>
        </block>
      </block>
      <block type="d">
        <block>D</block>
      </block>
    </block>
  </block>
)

export const run = editor => {
  editor.insertFragment(fragment)
}

export const input = (
  <value>
    <block type="d">
      <block>
        <text>
          <cursor />
        </text>
      </block>
    </block>
  </value>
)

export const output = input

export const skip = true
