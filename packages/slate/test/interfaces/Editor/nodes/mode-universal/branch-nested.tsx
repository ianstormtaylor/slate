/** @jsx jsx */
import { Editor } from 'slate'
import { jsx } from '../../../..'

export const input = (
  <editor>
    <block a>
      <block b>one</block>
    </block>
    <block b>
      <block a>two</block>
    </block>
  </editor>
)
export const test = editor => {
  return Array.from(
    Editor.nodes(editor, {
      at: [],
      match: n => n.a === true,
      mode: 'lowest',
      universal: true,
    })
  )
}
export const output = [
  [
    <block a>
      <block b>one</block>
    </block>,
    [0],
  ],
  [<block a>two</block>, [1, 0]],
]
