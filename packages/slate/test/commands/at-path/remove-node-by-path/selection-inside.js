/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>one</block>
    <block>
      <text>
        t<cursor />wo
      </text>
    </block>
  </value>
)

export const run = editor => {
  editor.removeNodeAtPath([1, 0])
}

export const output = (
  <value>
    <block>
      one<cursor />
    </block>
    <block>
      <text />
    </block>
  </value>
)
