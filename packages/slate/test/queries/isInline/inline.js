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
  const inline = editor.value.nodes[0].nodes[1]
  return editor.isInline(inline)
}

export const output = true
