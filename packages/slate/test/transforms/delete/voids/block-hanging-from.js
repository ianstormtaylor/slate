/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, )
}

export const input = (
  <value>
    <block void>
      <anchor />
    </block>
    <block>
      <focus />
      one
    </block>
    <block>two</block>
  </value>
)

export const output = (
  <value>
    <block>
      <cursor />
      one
    </block>
    <block>two</block>
  </value>
)
