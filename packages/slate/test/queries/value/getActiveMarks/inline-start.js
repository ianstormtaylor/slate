/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>
      <mark key="a">one</mark>
      <inline>
        <cursor />two
      </inline>
      three
    </block>
    <block />
  </value>
)

export const run = editor => {
  return Array.from(editor.getActiveMarks())
}

export const output = []
