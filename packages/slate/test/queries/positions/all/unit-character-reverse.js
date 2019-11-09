/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>
      one<inline>two</inline>three
    </block>
    <block>
      four<inline>five</inline>six
    </block>
  </value>
)

export const run = editor => {
  return Array.from(
    editor.positions({ at: [], unit: 'character', reverse: true })
  )
}

export const output = [
  { path: [1, 2], offset: 3 },
  { path: [1, 2], offset: 2 },
  { path: [1, 2], offset: 1 },
  { path: [1, 2], offset: 0 },
  { path: [1, 1, 0], offset: 3 },
  { path: [1, 1, 0], offset: 2 },
  { path: [1, 1, 0], offset: 1 },
  { path: [1, 1, 0], offset: 0 },
  { path: [1, 0], offset: 3 },
  { path: [1, 0], offset: 2 },
  { path: [1, 0], offset: 1 },
  { path: [1, 0], offset: 0 },
  { path: [0, 2], offset: 5 },
  { path: [0, 2], offset: 4 },
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
