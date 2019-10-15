/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.replaceTextAtPath([0, 0], 'two')
}

export const input = (
  <value>
    <block>
      <cursor />one
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      two<cursor />
    </block>
  </value>
)
