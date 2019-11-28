/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.move(editor, { edge: 'anchor' })
}

export const input = (
  <editor>
    <block>
      one <anchor />
      two th
      <focus />
      ree
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      one t<anchor />
      wo th
      <focus />
      ree
    </block>
  </editor>
)
