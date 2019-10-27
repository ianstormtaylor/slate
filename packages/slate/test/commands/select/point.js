/** @jsx h */

import { h } from '../../helpers'

export const run = editor => {
  editor.select({
    path: [0, 0],
    offset: 1,
  })
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
      o<cursor />ne
    </block>
  </value>
)
