/** @jsx h */

import { h } from '../../../../helpers'

export const input = (
  <value>
    <block>
      one<inline>two</inline>three<inline>four</inline>five
    </block>
  </value>
)

export const run = editor => {
  return Array.from(editor.positions({ point: { path: [0, 0], offset: 2 } }))
}

export const output = [
  { path: [0, 0], offset: 2 },
  { path: [0, 0], offset: 3 },
  { path: [0, 1, 0], offset: 0 },
  { path: [0, 1, 0], offset: 1 },
  { path: [0, 1, 0], offset: 2 },
  { path: [0, 1, 0], offset: 3 },
  { path: [0, 2], offset: 0 },
  { path: [0, 2], offset: 1 },
  { path: [0, 2], offset: 2 },
  { path: [0, 2], offset: 3 },
  { path: [0, 2], offset: 4 },
  { path: [0, 2], offset: 5 },
  { path: [0, 3, 0], offset: 0 },
  { path: [0, 3, 0], offset: 1 },
  { path: [0, 3, 0], offset: 2 },
  { path: [0, 3, 0], offset: 3 },
  { path: [0, 3, 0], offset: 4 },
  { path: [0, 4], offset: 0 },
  { path: [0, 4], offset: 1 },
  { path: [0, 4], offset: 2 },
  { path: [0, 4], offset: 3 },
  { path: [0, 4], offset: 4 },
]
