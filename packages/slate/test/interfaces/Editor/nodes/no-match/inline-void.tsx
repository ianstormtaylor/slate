/** @jsx jsx */
import { Editor } from 'slate'
import { jsx } from '../../../..'

export const input = (
  <editor>
    <block>
      one<inline void>two</inline>three
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
      one<inline void>two</inline>three
    </block>,
    [0],
  ],
  [<text>one</text>, [0, 0]],
  [<inline void>two</inline>, [0, 1]],
  [<text>three</text>, [0, 2]],
]
