/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>one</block>
  </value>
)

export const run = editor => {
  return Array.from(editor.blocks())
}

export const output = [[<block>one</block>, [0]]]
