/** @jsx h */

import { h } from '../../helpers'

export const input = (
  <value>
    <block>
      one<inline>two</inline>three
    </block>
  </value>
)

export const run = editor => {
  const inline = editor.value.nodes[0].nodes[1]
  return editor.isVoid(inline)
}

export const output = false
