/** @jsx h */

import { h } from '../../helpers'

export const run = editor => {
  editor.addMarks([{ key: 'a' }])
  editor.flush()
  editor.undo()
}

export const input = (
  <value>
    <block>
      <mark key="b">
        w<anchor />o
      </mark>
      r<focus />d
    </block>
  </value>
)

export const output = input
