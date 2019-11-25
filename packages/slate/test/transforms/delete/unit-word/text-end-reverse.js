/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, { unit: 'word', reverse: true })
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
      one two <cursor />
    </block>
  </value>
)
