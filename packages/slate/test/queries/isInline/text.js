/** @jsx h */

import { h } from '../../helpers'

export const input = (
  <value>
    <block>one</block>
  </value>
)

export const run = editor => {
  const text = editor.value.nodes[0].nodes[0]
  return editor.isInline(text)
}

export const output = false
