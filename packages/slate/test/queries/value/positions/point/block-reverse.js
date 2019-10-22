/** @jsx h */

import { h } from '../../../../helpers'

export const input = (
  <value>
    <block>one</block>
  </value>
)

export const run = editor => {
  return Array.from(
    editor.positions({ reverse: true, point: { path: [0, 0], offset: 2 } })
  )
}

export const output = [
  { path: [0, 0], offset: 2 },
  { path: [0, 0], offset: 1 },
  { path: [0, 0], offset: 0 },
]
