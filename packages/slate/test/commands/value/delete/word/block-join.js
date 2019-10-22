/** @jsx h */

import { h } from '../../../../helpers'

export const run = editor => {
  editor.delete({ unit: 'word' })
}

export const input = (
  <value>
    <block>
      word<cursor />
    </block>
    <block>another</block>
  </value>
)

export const output = (
  <value>
    <block>
      word<cursor />another
    </block>
  </value>
)
