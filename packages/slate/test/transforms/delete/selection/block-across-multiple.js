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
    <block>three</block>
    <block>
      four
      <focus />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <cursor />
    </block>
  </value>
)
