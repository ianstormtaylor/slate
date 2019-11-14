/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    <block>
      wor
      <anchor />d<focus />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      wor
      <cursor />
    </block>
  </value>
)
