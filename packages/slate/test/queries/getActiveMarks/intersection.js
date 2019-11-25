/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../..'

export const input = (
  <value>
    <block>
      <mark key="a">
        <anchor />o
      </mark>
      n
      <mark key="b">
        e<focus />
      </mark>
    </block>
  </value>
)

export const run = editor => {
  return Array.from(Editor.activeMarks(editor))
}

export const output = []
