/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.move(editor, { distance: 6 })
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
      one two th
      <cursor />
      ree
    </block>
  </value>
)
