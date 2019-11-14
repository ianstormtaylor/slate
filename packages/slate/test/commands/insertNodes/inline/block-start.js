/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.insertNodes(
    <inline void>
      <text />
    </inline>
  )
}

export const input = (
  <value>
    <block>
      <cursor />
      word
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
      word
    </block>
  </value>
)
