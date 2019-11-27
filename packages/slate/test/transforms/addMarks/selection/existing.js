/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.addMarks(editor, [{ key: 'a' }])
}

export const input = (
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

export const output = (
  <editor>
    <block>
      <mark key="a">
        <mark key="b">
          <anchor />
          wo
          <focus />
        </mark>
      </mark>
      <mark key="b">rd</mark>
    </block>
  </editor>
)
