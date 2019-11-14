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
  const inline = editor.value.children[0].children[1]
  return editor.isInline(inline)
}

export const output = true
