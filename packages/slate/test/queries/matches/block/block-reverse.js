/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>one</block>
    <block>two</block>
    <block>three</block>
  </editor>
)

export const run = editor => {
  return Array.from(
    Editor.matches(editor, { at: [], match: 'block', reverse: true })
  )
}

export const output = [
  [<block>three</block>, [2]],
  [<block>two</block>, [1]],
  [<block>one</block>, [0]],
]
