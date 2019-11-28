/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor)
}

export const input = (
  <editor>
    <block>
      word
      <anchor />
    </block>
    <block>
      <focus />
      another
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      word
      <cursor />
      another
    </block>
  </editor>
)
