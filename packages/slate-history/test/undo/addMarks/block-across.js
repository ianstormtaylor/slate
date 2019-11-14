/** @jsx jsx */

import { jsx } from '../../helpers'

export const run = editor => {
  editor.addMarks([{ key: 'a' }])
}

export const input = (
  <value>
    <block>
      o<anchor />
      ne
    </block>
    <block>
      tw
      <focus />o
    </block>
  </value>
)

export const output = input
