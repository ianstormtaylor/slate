/** @jsx h */

import { h } from '../../../../helpers'

export const input = (
  <value>
    <block>one</block>
    <block>two</block>
  </value>
)

export const run = editor => {
  return Array.from(editor.positions({ point: { path: [0, 0], offset: 3 } }))
}

export const output = [
  { path: [0, 0], offset: 3 },
  { path: [1, 0], offset: 0 },
  { path: [1, 0], offset: 1 },
  { path: [1, 0], offset: 2 },
  { path: [1, 0], offset: 3 },
]
