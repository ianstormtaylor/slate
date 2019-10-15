/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.removeTextAtPath([0, 1, 0], 0, 1)
}

export const input = (
  <value>
    <block>
      <text />
      <emoji>
        <text>
          <cursor />a
        </text>
      </emoji>
      <text />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <text />
      <emoji>
        <cursor />
      </emoji>
      <text />
    </block>
  </value>
)
