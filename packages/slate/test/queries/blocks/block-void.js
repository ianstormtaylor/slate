/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block void>
      <block>one</block>
    </block>
  </value>
)

export const run = editor => {
  return Array.from(editor.blocks())
}

export const output = [
  [
    <block void>
      <block>one</block>
    </block>,
    [0],
  ],
]
