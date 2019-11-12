/** @jsx jsx */

import { jsx } from '../../../helpers'

export const input = (
  <value>
    <block>one</block>
    <block>two</block>
  </value>
)

export const run = editor => {
  return Array.from(editor.positions({ at: [1, 0] }))
}

export const output = [
  { path: [1, 0], offset: 0 },
  { path: [1, 0], offset: 1 },
  { path: [1, 0], offset: 2 },
  { path: [1, 0], offset: 3 },
]
