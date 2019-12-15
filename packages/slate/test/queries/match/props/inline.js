/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block a>
      one<inline>two</inline>three
    </block>
  </editor>
)

export const run = editor => {
  return Editor.match(editor, { at: [0, 1, 0], match: { a: true } })
}

export const output = [
  <block a>
    one<inline>two</inline>three
  </block>,
  [0],
]
