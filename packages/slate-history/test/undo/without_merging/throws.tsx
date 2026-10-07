/** @jsx jsx */
import assert from 'assert'
import { jsx } from '../..'
import { HistoryEditor } from '../../..'
import { cloneDeep } from 'lodash'

export const run = editor => {
  assert.throws(() => {
    HistoryEditor.withoutMerging(editor, () => {
      throw new Error('boom')
    })
  }, /boom/)
  editor.insertText('a')
  editor.insertText('b')
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
