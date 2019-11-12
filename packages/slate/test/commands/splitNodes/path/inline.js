/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.splitNodes({ at: [0, 1, 0] })
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
        <text />
      </inline>
      <text />
      <inline>
        <text>word</text>
      </inline>
      <text />
    </block>
  </value>
)
