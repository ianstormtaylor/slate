/** @jsx h */

import { h } from '../../helpers'

export const input = (
  <value>
    <block>
      <cursor />one
    </block>
  </value>
)

export const run = editor => {
  const { anchor } = editor.value.selection
  return editor.isEnd(anchor, [0])
}

export const output = false
