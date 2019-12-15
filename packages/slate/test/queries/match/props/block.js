/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block a>one</block>
  </editor>
)

export const run = editor => {
  return Editor.match(editor, { at: [0, 0], match: { a: true } })
}

export const output = [<block a>one</block>, [0]]
