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
    <block>
      <focus />
      two
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <cursor />
    </block>
    <block>two</block>
  </value>
)
