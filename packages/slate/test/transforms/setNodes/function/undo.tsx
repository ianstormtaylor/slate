/** @jsx jsx */
import { Editor, Operation, Transforms } from 'slate'
import { jsx } from '../../..'

export const run = (editor: Editor) => {
  Transforms.setNodes(editor, () => ({ id: 'x' }), {
    at: [],
    match: (n, p) => p.length === 1,
  })
  for (const op of [...editor.operations].reverse()) {
    editor.apply(Operation.inverse(op))
  }
}
export const input = (
  <editor>
    <block id="a">one</block>
    <block>two</block>
  </editor>
)
export const output = (
  <editor>
    <block id="a">one</block>
    <block>two</block>
  </editor>
)
