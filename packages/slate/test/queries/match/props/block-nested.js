/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block a>
      <block a>one</block>
    </block>
  </editor>
)

export const run = editor => {
  return Editor.match(editor, [0, 0, 0], { a: true })
}

export const output = [
  <block a>
    <block a>one</block>
  </block>,
  [0],
]
