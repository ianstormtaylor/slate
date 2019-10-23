/** @jsx h */

import { h } from '../../../../helpers'

export const input = (
  <value>
    <block>
      one<inline>two</inline>three
    </block>
  </value>
)

export const run = editor => {
  return Array.from(
    editor.positions({
      unit: 'character',
      reverse: true,
      point: { path: [0, 2], offset: 3 },
    })
  )
}

export const output = [
  { path: [0, 2], offset: 3 },
  { path: [0, 2], offset: 2 },
  { path: [0, 2], offset: 1 },
  { path: [0, 2], offset: 0 },
  { path: [0, 1, 0], offset: 2 },
  { path: [0, 1, 0], offset: 1 },
  { path: [0, 1, 0], offset: 0 },
  { path: [0, 0], offset: 2 },
  { path: [0, 0], offset: 1 },
  { path: [0, 0], offset: 0 },
]
