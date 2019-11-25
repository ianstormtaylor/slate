/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, { unit: 'word' })
}

export const input = (
  <value>
    <block>
      <cursor />
      one two three
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <cursor /> two three
    </block>
  </value>
)
