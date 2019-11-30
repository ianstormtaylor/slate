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
    Editor.nodes(editor, { at: [], match: 'block', mode: 'highest' })
  )
}

export const output = [
  [<block>one</block>, [0]],
  [<block>two</block>, [1]],
  [<block>three</block>, [2]],
]
