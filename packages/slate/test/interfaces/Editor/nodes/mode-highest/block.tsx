/** @jsx jsx */
import { Editor } from 'slate'
import { jsx } from '../../../..'

export const input = (
  <editor>
    <block a>
      <block a>one</block>
    </block>
    <block a>
      <block a>two</block>
    </block>
  </editor>
)
export const test = editor => {
  return Array.from(
    Editor.nodes(editor, { at: [], match: n => n.a, mode: 'highest' })
  )
}
export const output = [
  [
    <block a>
      <block a>one</block>
    </block>,
    [0],
  ],
  [
    <block a>
      <block a>two</block>
    </block>,
    [1],
  ],
]
