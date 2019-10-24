/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.moveNodes({ depth: 2, to: [0] })
}

export const input = (
  <value>
    <block>
      <block>
        <anchor />one
      </block>
      <block>
        <focus />two
      </block>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <anchor />one
    </block>
    <block>
      <focus />two
    </block>
    <block>
      <text />
    </block>
  </value>
)
