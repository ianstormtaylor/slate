/** @jsx jsx */
import assert from 'assert'
import { jsx } from '../..'
import { HistoryEditor } from '../../..'

export const run = editor => {
  editor.insertText('x')
  HistoryEditor.withNewBatch(editor, () => {
    assert.throws(() => {
      HistoryEditor.withNewBatch(editor, () => {
        throw new Error('boom')
      })
    }, /boom/)
    editor.insertText('y')
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
