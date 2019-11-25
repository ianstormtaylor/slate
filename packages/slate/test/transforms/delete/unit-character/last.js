/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, { unit: 'character' })
}

export const input = (
  <value>
    <block>
      wor
      <cursor />d
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      wor
      <cursor />
    </block>
  </value>
)
