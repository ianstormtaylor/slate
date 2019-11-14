/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.delete({ unit: 'character' })
}

export const input = (
  <value>
    <block>
      <cursor />
      📛word
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <cursor />
      word
    </block>
  </value>
)
