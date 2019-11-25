/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.removeMarks(editor, [{ key: 'a' }])
}

export const input = (
  <value>
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
  </value>
)

export const output = (
  <value>
    <block>
      <mark key="b">
        <anchor />
        wo
        <focus />
        rd
      </mark>
    </block>
  </value>
)
