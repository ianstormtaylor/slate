/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../..'

export const run = editor => {
  Editor.deselect(editor)
}

export const input = (
  <value>
    <block>
      <cursor focused={false} />
      one
    </block>
  </value>
)

export const output = (
  <value>
    <block>one</block>
  </value>
)
