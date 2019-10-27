/** @jsx h */

import { h } from '../../helpers'

export const input = (
  <value>
    <block>
      <mark key="a">one</mark>
      <cursor />two
    </block>
    <block />
  </value>
)

export const run = editor => {
  return Array.from(editor.getActiveMarks())
}

export const output = [{ key: 'a' }]
