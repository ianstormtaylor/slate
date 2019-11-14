/** @jsx jsx */

import { jsx } from '../../helpers'

export const input = (
  <value>
    <block>one</block>
  </value>
)

export const run = editor => {
  const block = editor.value.children[0]
  return editor.hasBlocks(block)
}

export const output = false
