/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>one</block>
  </value>
)

export const run = editor => {
  const { value } = editor
  return editor.isVoid(value)
}

export const output = false
