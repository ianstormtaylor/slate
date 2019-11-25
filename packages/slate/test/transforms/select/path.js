/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../..'

export const run = editor => {
  Editor.select(editor, [0, 0])
}

export const input = (
  <value>
    <block>
      <cursor />
      one
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <anchor />
      one
      <focus />
    </block>
  </value>
)
