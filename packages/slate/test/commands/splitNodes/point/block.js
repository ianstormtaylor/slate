/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.splitNodes({
    at: { path: [0, 0], offset: 2 },
    match: ([, p]) => p.length === 1,
  })
}

export const input = (
  <value>
    <block>
      <text>word</text>
    </block>
  </value>
)

export const output = (
  <value>
    <block>wo</block>
    <block>rd</block>
  </value>
)
