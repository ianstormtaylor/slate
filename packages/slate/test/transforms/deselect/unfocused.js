/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../..'

export const run = editor => {
  Editor.deselect(editor)
}

export const input = (
  <editor>
    <block>
      <cursor focused={false} />
      one
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>one</block>
  </editor>
)
