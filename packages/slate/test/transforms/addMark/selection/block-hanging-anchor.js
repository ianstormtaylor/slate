/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.addMark(editor, 'italic', true)
}

export const input = (
  <editor>
    <block>
      <text>
        zero
        <anchor />
      </text>
      <text bold>
        one two
        <focus />
      </text>
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      <text>
        zero
        <anchor />
      </text>
      <text bold italic>
        one two
        <focus />
      </text>
    </block>
  </editor>
)
