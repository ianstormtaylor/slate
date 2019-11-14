/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.splitNodes({ match: 'block' })
}

export const input = (
  <value>
    <block>
      <text>
        one
        <cursor />
      </text>
      <text>two</text>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one
      <cursor />
    </block>
    <block>two</block>
  </value>
)
