/** @jsx h */

import { h } from '../../helpers'

export const input = (
  <value>
    <block>
      one<inline>two</inline>three
    </block>
  </value>
)

export const run = editor => {
  return editor.getClosestBlock([0, 1, 0])
}

export const output = [
  <block>
    one<inline>two</inline>three
  </block>,
  [0],
]
