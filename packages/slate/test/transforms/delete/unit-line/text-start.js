/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, { unit: 'line' })
}

export const input = (
  <editor>
    <block>
      <cursor />
      one two three
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      <cursor />
    </block>
  </editor>
)
