/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      <text>
        w<anchor />
        or
        <focus />d
      </text>
    </block>
  </editor>
)

export const run = editor => {
  Editor.insertText(editor, 'x', { at: { path: [0, 0], offset: 1 } })
}

export const output = (
  <editor>
    <block>
      wx
      <anchor />
      or
      <focus />d
    </block>
  </editor>
)
