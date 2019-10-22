/** @jsx h */

import { h } from '../../../../helpers'

export const run = editor => {
  editor.delete({ unit: 'character' })
}

export const input = (
  <value>
    <block>
      wo<cursor />rd
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      wo<cursor />d
    </block>
  </value>
)
