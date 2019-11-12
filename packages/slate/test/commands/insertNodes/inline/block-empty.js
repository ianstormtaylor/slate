/** @jsx jsx */

import { jsx } from '../../../helpers'

export const input = (
  <value>
    <block>
      <cursor />
    </block>
  </value>
)

export const run = editor => {
  editor.insertNodes(
    <inline void>
      <text />
    </inline>
  )
}

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
