/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    <block>
      <anchor />w<focus />ord
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <cursor />ord
    </block>
  </value>
)
