/** @jsx h */

import { h } from '../../../../helpers'

export const input = (
  <value>
    <block>one two three</block>
    <block>four five six</block>
  </value>
)

export const run = editor => {
  return Array.from(
    editor.positions({ unit: 'line', point: { path: [0, 0], offset: 3 } })
  )
}

export const output = [
  { path: [0, 0], offset: 3 },
  { path: [0, 0], offset: 13 },
  { path: [1, 0], offset: 13 },
]
