/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.move(editor, { reverse: true, distance: 6 })
}

export const input = (
  <editor>
    <block>
      one two th
      <cursor />
      ree
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      one <cursor />
      two three
    </block>
  </editor>
)
