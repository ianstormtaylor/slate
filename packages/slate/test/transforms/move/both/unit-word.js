/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.move(editor, { unit: 'word' })
}

export const input = (
  <value>
    <block>
      one <cursor />
      two three
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one two
      <cursor /> three
    </block>
  </value>
)
