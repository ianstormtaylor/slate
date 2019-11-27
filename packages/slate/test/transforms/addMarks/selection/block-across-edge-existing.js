/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.addMarks(editor, [{ key: 'a' }])
}

export const input = (
  <editor>
    <block>
      wo
      <mark key="b">
        <anchor />
        rd
      </mark>
    </block>
    <block>
      <mark key="b">an</mark>
      <focus />
      other
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      wo
      <mark key="a">
        <mark key="b">
          <anchor />
          rd
        </mark>
      </mark>
    </block>
    <block>
      <mark key="a">
        <mark key="b">an</mark>
      </mark>
      <focus />
      other
    </block>
  </editor>
)
