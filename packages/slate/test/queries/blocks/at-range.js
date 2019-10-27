/** @jsx h */

import { h } from '../../helpers'

export const input = (
  <value>
    <block>one</block>
    <block>two</block>
    <block>three</block>
  </value>
)

export const run = editor => {
  return Array.from(
    editor.blocks({
      at: { anchor: { path: [1], offset: 0 }, focus: { path: [1], offset: 3 } },
    })
  )
}

export const output = [[<block>two</block>, [1]]]
