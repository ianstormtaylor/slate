/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, { unit: 'line', reverse: true })
}

export const input = (
  <value>
    <block>
      one two three
      <cursor />
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
