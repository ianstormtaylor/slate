/** @jsx jsx */

import { jsx } from '../../helpers'

export const run = editor => {
  editor.select([0, 0])
}

export const input = (
  <value>
    <block>
      <cursor />
      one
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <anchor />
      one
      <focus />
    </block>
  </value>
)
