/** @jsx h */

import { h } from '../../helpers'

export const input = (
  <value>
    <block>
      <block>one</block>
    </block>
  </value>
)

export const run = editor => {
  const block = editor.value.nodes[0]
  return editor.hasBlocks(block)
}

export const output = true
