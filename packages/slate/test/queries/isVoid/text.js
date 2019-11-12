/** @jsx jsx */

import { jsx } from '../../helpers'

export const input = (
  <value>
    <block>one</block>
  </value>
)

export const run = editor => {
  const text = editor.value.nodes[0].nodes[0]
  return editor.isVoid(text)
}

export const output = false
