/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor)
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
      <mark key="a">
        <cursor />
      </mark>
    </block>
  </editor>
)
