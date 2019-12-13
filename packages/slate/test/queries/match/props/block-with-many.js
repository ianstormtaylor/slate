/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block a b c>
      one
    </block>
  </editor>
)

export const run = editor => {
  return Editor.match(editor, [0, 0], { a: true })
}

export const output = [
  <block a b c>
    one
  </block>,
  [0],
]
