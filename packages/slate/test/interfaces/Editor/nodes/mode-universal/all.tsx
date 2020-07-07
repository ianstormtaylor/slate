/** @jsx jsx */
import { Editor } from 'slate'
import { jsx } from '../../../..'

export const input = (
  <editor>
    <block a>one</block>
    <block a>two</block>
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
  [<block a>one</block>, [0]],
  [<block a>two</block>, [1]],
]
