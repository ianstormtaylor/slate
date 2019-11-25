/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, { unit: 'character' })
}

export const input = (
  <value>
    <block>
      <cursor />
      word
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <cursor />
      ord
    </block>
  </value>
)
