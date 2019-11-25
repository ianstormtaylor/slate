/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, { unit: 'line', reverse: true })
}

export const input = (
  <value>
    <block>
      <cursor />
      one two three
    </block>
  </value>
)

export const output = input
