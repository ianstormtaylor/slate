/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.insertText(editor, 'a')
}

export const input = (
  <value>
    <block>
      <anchor />
      one
    </block>
    <block>two</block>
    <block>
      <focus />
      three
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      a<cursor />
      three
    </block>
  </value>
)

export const skip = true
