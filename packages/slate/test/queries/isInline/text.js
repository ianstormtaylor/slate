/** @jsx jsx */

import { jsx } from '../../helpers'

export const input = (
  <value>
    <block>one</block>
  </value>
)

export const run = editor => {
  const text = editor.value.children[0].children[0]
  return editor.isInline(text)
}

export const output = false
