/** @jsx jsx */
import { Editor } from 'slate'
import { jsx } from '../../../..'

export const input = (
  <editor>
    <block pass>
      <block match>one</block>
    </block>
    <block>
      <block match>two</block>
      <block pass match>
        three
      </block>
    </block>
  </editor>
)
export const test = editor => {
  return Array.from(
    Editor.nodes(editor, {
      at: [],
      match: n => !!n.match,
      pass: ([n]) => !!n.pass,
    })
  )
}
export const output = [
  [<block match>two</block>, [1, 0]],
  [
    <block pass match>
      three
    </block>,
    [1, 1],
  ],
]
