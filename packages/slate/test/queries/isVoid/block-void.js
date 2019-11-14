/** @jsx jsx */

import { jsx } from '../../helpers'

export const input = (
  <value>
    <block void>one</block>
  </value>
)

export const run = editor => {
  const block = editor.value.children[0]
  return editor.isVoid(block)
}

export const output = true
