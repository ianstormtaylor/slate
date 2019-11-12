/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.delete({ unit: 'line', reverse: true })
}

export const input = (
  <value>
    <block>
      <cursor />
      one two three
    </block>
  </value>
)

export const output = input
