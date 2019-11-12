/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.splitNodes({ at: { path: [0, 1, 0], offset: 2 } })
}

export const input = (
  <value>
    <block>
      <text />
      <inline void>
        <text>word</text>
      </inline>
      <text />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <text />
      <inline void>
        <text>word</text>
      </inline>
      <text />
    </block>
    <block>
      <text />
    </block>
  </value>
)
