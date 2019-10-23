/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.insertInline(
    <inline void>
      <text />
    </inline>
  )
}

export const input = (
  <value>
    <block void>
      <cursor />
    </block>
  </value>
)

export const output = (
  <value>
    <block void>
      <cursor />
    </block>
  </value>
)
