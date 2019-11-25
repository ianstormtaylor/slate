/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, )
}

export const input = (
  <value>
    <block>
      <anchor />w<focus />
      ord
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <cursor />
      ord
    </block>
  </value>
)
