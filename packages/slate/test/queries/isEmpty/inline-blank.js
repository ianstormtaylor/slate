/** @jsx h */

import { h } from '../../helpers'

export const input = (
  <value>
    <block>
      one
      <inline>
        <text />
      </inline>
      three
    </block>
  </value>
)

export const run = editor => {
  const inline = editor.value.nodes[0].nodes[1]
  return editor.isEmpty(inline)
}

export const output = true
