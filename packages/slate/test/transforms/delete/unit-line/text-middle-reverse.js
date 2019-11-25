/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, { unit: 'line', reverse: true })
}

export const input = (
  <value>
    <block>
      one two thr
      <cursor />
      ee
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <cursor />
      ee
    </block>
  </value>
)
