/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>one two three</block>
    <block>four five six</block>
  </value>
)

export const run = editor => {
  return Array.from(editor.positions({ unit: 'word', reverse: true }))
}

export const output = [
  { path: [1, 0], offset: 13 },
  { path: [1, 0], offset: 10 },
  { path: [1, 0], offset: 5 },
  { path: [1, 0], offset: 0 },
  { path: [0, 0], offset: 8 },
  { path: [0, 0], offset: 4 },
  { path: [0, 0], offset: 0 },
]
