/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.delete({ unit: 'word' })
}

export const input = (
  <value>
    <block>
      <cursor />one two three
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <cursor /> two three
    </block>
  </value>
)
