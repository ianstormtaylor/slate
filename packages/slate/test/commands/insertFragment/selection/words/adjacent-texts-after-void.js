/** @jsx jsx */

import { jsx } from '../../../../helpers'

export const run = editor => {
  editor.insertFragment(
    <block>
      <text>one</text>
      <text>two</text>
    </block>
  )
}

export const input = (
  <value>
    <block>
      <inline void>
        <text />
      </inline>
      <cursor />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <inline void>
        <text />
      </inline>
      <text>
        onetwo
        <cursor />
      </text>
    </block>
  </value>
)
