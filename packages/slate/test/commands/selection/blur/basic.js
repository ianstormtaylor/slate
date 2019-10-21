/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.blur()
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
      <cursor focused={false} />one
    </block>
  </value>
)
