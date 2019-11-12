/** @jsx jsx */

import { jsx } from '../../../helpers'

export const input = (
  <value>
    <block>
      one<inline>two</inline>three
    </block>
  </value>
)

export const run = editor => {
  return Array.from(editor.positions({ reverse: true, at: [0, 1] }))
}

export const output = [
  { path: [0, 1, 0], offset: 3 },
  { path: [0, 1, 0], offset: 2 },
  { path: [0, 1, 0], offset: 1 },
  { path: [0, 1, 0], offset: 0 },
]
