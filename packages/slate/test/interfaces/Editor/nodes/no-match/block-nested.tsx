/** @jsx jsx */
import { Editor } from 'slate'
import { jsx } from '../../../..'

export const input = (
  <editor>
    <block>
      <block>one</block>
    </block>
    <block>
      <block>two</block>
    </block>
  </editor>
)
export const test = editor => {
  return Array.from(Editor.nodes(editor, { at: [] }))
}
export const output = [
  [input, []],
  [
    <block>
      <block>one</block>
    </block>,
    [0],
  ],
  [<block>one</block>, [0, 0]],
  [<text>one</text>, [0, 0, 0]],
  [
    <block>
      <block>two</block>
    </block>,
    [1],
  ],
  [<block>two</block>, [1, 0]],
  [<text>two</text>, [1, 0, 0]],
]
