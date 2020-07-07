/** @jsx jsx */
import { Editor, Text } from 'slate'
import { jsx } from '../../../..'

export const input = (
  <editor>
    <block>
      one<inline void>two</inline>three
    </block>
  </editor>
)
export const test = editor => {
  return Array.from(
    Editor.nodes(editor, { at: [], match: Text.isText, voids: true })
  )
}
export const output = [
  [<text>one</text>, [0, 0]],
  [<text>two</text>, [0, 1, 0]],
  [<text>three</text>, [0, 2]],
]
