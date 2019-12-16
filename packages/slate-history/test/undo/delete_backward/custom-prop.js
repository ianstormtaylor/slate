/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../..'

export const run = editor => {
  Editor.delete(editor)
}

export const input = (
  <editor>
    <block a>
      o<anchor />
      ne
    </block>
    <block b>
      tw
      <focus />o
    </block>
  </editor>
)

export const output = input
