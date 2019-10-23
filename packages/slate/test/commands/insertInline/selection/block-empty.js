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
    <block>
      <cursor />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <text />
      <inline void>
        <cursor />
      </inline>
      <text />
    </block>
  </value>
)
