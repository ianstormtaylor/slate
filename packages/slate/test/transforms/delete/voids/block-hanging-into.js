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
    <block void>
      <focus />
      two
    </block>
    <block>three</block>
  </value>
)

export const output = (
  <value>
    <block>
      <cursor />
    </block>
    <block>three</block>
  </value>
)
