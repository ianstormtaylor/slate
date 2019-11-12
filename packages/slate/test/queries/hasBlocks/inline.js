/** @jsx jsx */

import { jsx } from '../../helpers'

export const input = (
  <value>
    <block>
      one<inline>two</inline>three
    </block>
  </value>
)

export const run = editor => {
  const block = editor.value.nodes[0]
  return editor.hasBlocks(block)
}

export const output = false
