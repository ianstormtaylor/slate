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
  const inline = editor.value.children[0].children[1]
  return editor.isVoid(inline)
}

export const output = false
