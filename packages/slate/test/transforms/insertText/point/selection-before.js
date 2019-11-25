/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <value>
    <block>
      <text>
        w<anchor />
        or
        <focus />d
      </text>
    </block>
  </value>
)

export const run = editor => {
  Editor.insertText(editor, 'x', { at: { path: [0, 0], offset: 0 } })
}

export const output = (
  <value>
    <block>
      xw
      <anchor />
      or
      <focus />d
    </block>
  </value>
)
