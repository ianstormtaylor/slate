/** @jsx jsx */

import { jsx } from '../../../helpers'

export const input = (
  <value>
    <block>
      <block>one</block>
    </block>
    <block>
      <block>two</block>
    </block>
  </value>
)

export const run = editor => {
  return Array.from(editor.positions({ at: [] }))
}

export const output = [
  { path: [0, 0, 0], offset: 0 },
  { path: [0, 0, 0], offset: 1 },
  { path: [0, 0, 0], offset: 2 },
  { path: [0, 0, 0], offset: 3 },
  { path: [1, 0, 0], offset: 0 },
  { path: [1, 0, 0], offset: 1 },
  { path: [1, 0, 0], offset: 2 },
  { path: [1, 0, 0], offset: 3 },
]
