/** @jsx jsx */

import { jsx } from '../../../helpers'

export const input = (
  <value>
    <block>one</block>
    <block>two</block>
    <block>three</block>
  </value>
)

export const run = editor => {
  return Array.from(editor.positions({ at: [] }))
}

export const output = [
  { path: [0, 0], offset: 0 },
  { path: [0, 0], offset: 1 },
  { path: [0, 0], offset: 2 },
  { path: [0, 0], offset: 3 },
  { path: [1, 0], offset: 0 },
  { path: [1, 0], offset: 1 },
  { path: [1, 0], offset: 2 },
  { path: [1, 0], offset: 3 },
  { path: [2, 0], offset: 0 },
  { path: [2, 0], offset: 1 },
  { path: [2, 0], offset: 2 },
  { path: [2, 0], offset: 3 },
  { path: [2, 0], offset: 4 },
  { path: [2, 0], offset: 5 },
]
