/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.move(editor, { reverse: true })
}

export const input = (
  <editor>
    <block>
      one <cursor />
      two three
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      one
      <cursor /> two three
    </block>
  </editor>
)
