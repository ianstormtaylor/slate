/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../..'

export const input = (
  <value>
    <block>
      <mark key="a">one</mark>
    </block>
    <block>
      <cursor />
      two
    </block>
  </value>
)

export const run = editor => {
  return Array.from(Editor.activeMarks(editor))
}

export const output = []
