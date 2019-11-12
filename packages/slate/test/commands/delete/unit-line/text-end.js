/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.delete({ unit: 'line' })
}

export const input = (
  <value>
    <block>
      one two three
      <cursor />
    </block>
  </value>
)

export const output = input
