/** @jsx h */

import { h } from '../../helpers'

export const run = editor => {
  editor.deselect()
}

export const input = (
  <value>
    <block>
      <cursor focused={false} />one
    </block>
  </value>
)

export const output = (
  <value>
    <block>one</block>
  </value>
)
