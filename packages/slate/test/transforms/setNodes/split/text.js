/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.setNodes(editor, { key: true }, { match: 'text' })
}

export const input = (
  <editor>
    <block>
      w<anchor />
      or
      <focus />d
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      <text>w</text>
      <text key>
        <anchor />
        or
        <focus />
      </text>
      <text>d</text>
    </block>
  </editor>
)
