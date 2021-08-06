/** @jsx jsx */
import { jsx } from '../..'
import { cloneDeep } from 'lodash'

export const run = editor => {
  editor.insertText('t')
  editor.insertText('w')
  editor.insertText('o')
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
