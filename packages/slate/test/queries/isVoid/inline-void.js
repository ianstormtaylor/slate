/** @jsx jsx */

import { jsx } from '../../helpers'

export const input = (
  <value>
    <block>
      one<inline void>two</inline>three
    </block>
  </value>
)

export const run = editor => {
  const inline = editor.value.nodes[0].nodes[1]
  return editor.isVoid(inline)
}

export const output = true
