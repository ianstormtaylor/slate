/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../..'

export const run = editor => {
  Editor.select(editor, [0, 0])
}

export const input = (
  <editor>
    <block>
      <cursor />
      one
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      <anchor />
      one
      <focus />
    </block>
  </editor>
)
