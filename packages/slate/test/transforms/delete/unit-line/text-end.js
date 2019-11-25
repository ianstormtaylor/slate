/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, { unit: 'line' })
}

export const input = (
  <value>
    <block>
      one two three
      <cursor />
    </block>
  </value>
)

export const output = input
