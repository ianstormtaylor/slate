/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, { unit: 'line' })
}

export const input = (
  <editor>
    <block>
      one two three
      <cursor />
    </block>
  </editor>
)

export const output = input
