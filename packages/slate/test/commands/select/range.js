/** @jsx jsx */

import { jsx } from '../../helpers'

export const run = editor => {
  editor.select({
    anchor: {
      path: [0, 0],
      offset: 0,
    },
    focus: {
      path: [0, 0],
      offset: 3,
    },
  })
}

export const input = (
  <value>
    <block>
      <cursor />one
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <anchor />one<focus />
    </block>
  </value>
)
