/** @jsx jsx */
import assert from 'assert'
import { jsx } from '../..'
import { HistoryEditor } from '../../..'
import { cloneDeep } from 'lodash'

export const run = editor => {
  editor.insertText('x')
  assert.throws(() => {
    HistoryEditor.withNewBatch(editor, () => {
      throw new Error('boom')
    })
  }, /boom/)
  editor.insertText('y')
}
export const input = (
  <editor>
    <block>
      one
      <cursor />
    </block>
  </editor>
)
export const output = cloneDeep(input)
