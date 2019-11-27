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
      <anchor />
      rd
    </block>
    <block>
      an
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
        <anchor />
        rd
      </mark>
    </block>
    <block>
      <mark key="a">
        an
        <focus />
      </mark>
      other
    </block>
  </editor>
)
