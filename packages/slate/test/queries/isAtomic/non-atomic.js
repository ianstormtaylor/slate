/** @jsx h */

import { h } from '../../helpers'

export const input = (
  <value>
    <block>
      <mark>one</mark>
    </block>
  </value>
)

export const run = editor => {
  const [[mark]] = editor.marks()
  return editor.isAtomic(mark)
}

export const output = false
