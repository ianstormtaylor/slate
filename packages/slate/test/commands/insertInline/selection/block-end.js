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
      word<cursor />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      word<inline void>
        <cursor />
      </inline>
      <text />
    </block>
  </value>
)
