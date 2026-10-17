/** @jsx jsx */
import { Editor, Operation, Transforms } from 'slate'
import { jsx } from '../../..'

export const run = (editor: Editor) => {
  Transforms.setNodes(editor, { type: 'paragraph' }, { at: [0], replace: true })
  const [op] = editor.operations
  editor.apply(Operation.inverse(JSON.parse(JSON.stringify(op))))
}
export const input = (
  <editor>
    <block type="callout" data="blue">
      word
    </block>
  </editor>
)
export const output = (
  <editor>
    <block type="callout" data="blue">
      word
    </block>
  </editor>
)
