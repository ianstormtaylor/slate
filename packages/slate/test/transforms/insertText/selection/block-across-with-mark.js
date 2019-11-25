/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.insertText(editor, 'a')
  Editor.insertText(editor, 'b')
}

export const input = (
  <value>
    <block>
      <mark key="a">
        <anchor />
        one
      </mark>
    </block>
    <block>
      two
      <focus />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      ab
      <cursor />
    </block>
  </value>
)

export const skip = true
