/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, { reverse: true })
}

export const input = (
  <value>
    <block>one</block>
    <block>
      <cursor />
      two
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one
      <cursor />
      two
    </block>
  </value>
)
