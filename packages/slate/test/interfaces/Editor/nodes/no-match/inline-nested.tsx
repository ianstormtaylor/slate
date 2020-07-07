/** @jsx jsx */
import { Editor } from 'slate'
import { jsx } from '../../../..'

export const input = (
  <editor>
    <block>
      one
      <inline>
        two<inline>three</inline>four
      </inline>
      five
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
      one
      <inline>
        two<inline>three</inline>four
      </inline>
      five
    </block>,
    [0],
  ],
  [<text>one</text>, [0, 0]],
  [
    <inline>
      two<inline>three</inline>four
    </inline>,
    [0, 1],
  ],
  [<text>two</text>, [0, 1, 0]],
  [<inline>three</inline>, [0, 1, 1]],
  [<text>three</text>, [0, 1, 1, 0]],
  [<text>four</text>, [0, 1, 2]],
  [<text>five</text>, [0, 2]],
]
