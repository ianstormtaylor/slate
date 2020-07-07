/** @jsx jsx */
import { Editor } from 'slate'
import { jsx } from '../../../..'

export const input = (
  <editor>
    <block a>
      <block a>one</block>
    </block>
    <block b>
      <block b>two</block>
    </block>
  </editor>
)
export const test = editor => {
  return Array.from(
    Editor.nodes(editor, {
      at: [],
      match: n => n.a,
      mode: 'lowest',
      universal: true,
    })
  )
}
export const output = []
