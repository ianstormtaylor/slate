/** @jsx h */

import { h } from '../../helpers'

export const input = (
  <value>
    <block void>
      <text />
    </block>
  </value>
)

export const run = editor => {
  const block = editor.value.nodes[0]
  return editor.isEmpty(block)
}

export const output = false
