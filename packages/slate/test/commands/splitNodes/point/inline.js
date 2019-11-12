/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.splitNodes({ at: { path: [0, 1, 0], offset: 2 }, match: 2 })
}

export const input = (
  <value>
    <block>
      <text />
      <inline>
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
      <inline>
        <text>wo</text>
      </inline>
      <text />
      <inline>
        <text>rd</text>
      </inline>
      <text />
    </block>
  </value>
)
