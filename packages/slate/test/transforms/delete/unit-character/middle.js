/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, { unit: 'character' })
}

export const input = (
  <value>
    <block>
      wo
      <cursor />
      rd
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      wo
      <cursor />d
    </block>
  </value>
)
