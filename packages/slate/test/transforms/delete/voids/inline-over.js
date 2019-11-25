/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, )
}

export const input = (
  <value>
    <block>
      <anchor />
      one
    </block>
    <block>two</block>
    <block>
      three
      <inline void>four</inline>
      <focus />
      five
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <cursor />
      five
    </block>
  </value>
)

export const skip = true
