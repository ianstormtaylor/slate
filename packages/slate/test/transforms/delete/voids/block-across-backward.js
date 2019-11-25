/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, )
}

export const input = (
  <value>
    <block void>
      <focus />
    </block>
    <block>one</block>
    <block>
      two
      <anchor />
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
