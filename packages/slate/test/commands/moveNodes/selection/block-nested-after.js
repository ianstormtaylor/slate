/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.moveNodes({ depth: 2, to: [1] })
}

export const input = (
  <value>
    <block>
      <block>one</block>
      <block>
        <anchor />two
      </block>
      <block>
        <focus />three
      </block>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <block>one</block>
    </block>
    <block>
      <anchor />two
    </block>
    <block>
      <focus />three
    </block>
  </value>
)
