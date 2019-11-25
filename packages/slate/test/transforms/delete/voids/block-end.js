/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, )
}

export const input = (
  <value>
    <block>
      wo
      <anchor />
      rd
    </block>
    <block void>
      an
      <focus />
      other
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      wo
      <cursor />
    </block>
  </value>
)
