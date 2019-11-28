/** @jsx jsx  */

import { Editor } from 'slate'
import { jsx } from '../..'

export const input = (
  <editor>
    <block>
      one<inline>two</inline>three
    </block>
  </editor>
)

export const run = editor => {
  return Editor.text(editor, [0, 1])
}

export const output = `two`
