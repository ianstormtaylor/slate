/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.insertNodes(
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
