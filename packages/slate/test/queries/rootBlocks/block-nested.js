/** @jsx h */

import { h } from '../../helpers'

export const input = (
  <value>
    <block>
      <block>one</block>
    </block>
    <block>
      <block>two</block>
    </block>
  </value>
)

export const run = editor => {
  return Array.from(editor.rootBlocks())
}

export const output = [
  [
    <block>
      <block>one</block>
    </block>,
    [0],
  ],
  [
    <block>
      <block>two</block>
    </block>,
    [1],
  ],
]
