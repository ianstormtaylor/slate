/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>
      one<inline>two</inline>three
    </block>
  </value>
)

export const run = editor => {
  return editor.getMatch([0, 1, 0], 'block')
}

export const output = [
  <block>
    one<inline>two</inline>three
  </block>,
  [0],
]
