/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.setMarks(editor, [{ key: 'a' }], { thing: true })
}

export const input = (
  <editor>
    <block>
      <mark key="a">
        <anchor />
        word
        <focus />
      </mark>
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      <mark key="a" thing>
        <anchor />
        word
        <focus />
      </mark>
    </block>
  </editor>
)
