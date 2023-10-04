/** @jsx jsx */
import { Editor, Text } from 'slate'
import { jsx } from '../../../..'

export const input = (
  <editor>
    <block>
      one<inline nonSelectable>two</inline>three
    </block>
  </editor>
)
export const test = editor => {
  return Array.from(Editor.nodes(editor, { at: [], ignoreNonSelectable: true }))
}
export const output = [
  [input, []],
  [input.children[0], [0]],
  [input.children[0].children[0], [0, 0]],
  [input.children[0].children[2], [0, 2]],
]
