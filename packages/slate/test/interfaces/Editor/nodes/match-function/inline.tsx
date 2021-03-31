/** @jsx jsx */
import { Editor } from 'slate'
import { jsx } from '../../../..'

export const input = (
  <editor>
    <block>
      one<inline>two</inline>three
    </block>
  </editor>
)
export const test = editor => {
  return Array.from(
    Editor.nodes(editor, {
      at: [],
      match: n => Editor.isInline(editor, n),
    })
  )
}
export const output = [[<inline>two</inline>, [0, 1]]]
