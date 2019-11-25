/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, )
}

export const input = (
  <value>
    <block>
      wor
      <anchor />d<focus />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      wor
      <cursor />
    </block>
  </value>
)
