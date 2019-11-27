/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, { unit: 'word' })
}

export const input = (
  <editor>
    <block>
      word
      <cursor />
    </block>
    <block>another</block>
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
