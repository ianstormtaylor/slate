/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <value>
    <block>
      <block>one</block>
    </block>
    <block>
      <block>two</block>
    </block>
  </value>
)

export const run = editor => {
  return Array.from(Editor.matches(editor, { at: [], match: 'block' }))
}

export const output = [
  [<block>one</block>, [0, 0]],
  [<block>two</block>, [1, 0]],
]
