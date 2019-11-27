/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.removeMarks(editor, [{ key: 'a' }])
}

export const input = (
  <editor>
    <block>
      <anchor />
      <mark key="a">
        <mark key="b">wo</mark>
      </mark>
      <mark key="b">
        <focus />
        rd
      </mark>
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      <mark key="b">
        <anchor />
        wo
        <focus />
        rd
      </mark>
    </block>
  </editor>
)
