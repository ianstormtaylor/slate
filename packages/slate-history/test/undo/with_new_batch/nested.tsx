/** @jsx jsx */
import { jsx } from '../..'
import { HistoryEditor } from '../../..'

export const run = editor => {
  editor.insertText('x')
  HistoryEditor.withNewBatch(editor, () => {
    HistoryEditor.withNewBatch(editor, () => {
      editor.insertText('a')
    })
    editor.insertText('b')
  })
}
export const input = (
  <editor>
    <block>
      one
      <cursor />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      onex
      <cursor />
    </block>
  </editor>
)
