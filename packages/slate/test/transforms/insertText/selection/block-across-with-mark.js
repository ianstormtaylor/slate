/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.insertText(editor, 'a')
  Editor.insertText(editor, 'b')
}

export const input = (
  <editor>
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
  </editor>
)

export const output = (
  <editor>
    <block>
      ab
      <cursor />
    </block>
  </editor>
)

export const skip = true
