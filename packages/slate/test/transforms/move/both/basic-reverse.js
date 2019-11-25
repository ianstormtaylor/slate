/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.move(editor, { reverse: true })
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
      one
      <cursor /> two three
    </block>
  </value>
)
