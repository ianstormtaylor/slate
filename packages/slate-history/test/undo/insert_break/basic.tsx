/** @jsx jsx */
import { Editor } from 'slate'
import { jsx } from '../..'
import { cloneDeep } from 'lodash'

export const run = editor => {
  editor.insertBreak()
}
export const input = (
  <editor>
    <block>
      <block>
        on
        <cursor />e
      </block>
      <block>two</block>
    </block>
  </editor>
)
export const output = cloneDeep(input)
