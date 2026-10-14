/** @jsx jsx */
import { Editor, Transforms } from 'slate'
import { jsx } from '../../..'

export const run = (editor: Editor) => {
  Transforms.setNodes(editor, { type: 'paragraph' }, { at: [0], replace: true })
  if (editor.operations.length !== 0) {
    throw new Error('expected no operations')
  }
}
export const input = (
  <editor>
    <block type="paragraph">word</block>
  </editor>
)
export const output = (
  <editor>
    <block type="paragraph">word</block>
  </editor>
)
