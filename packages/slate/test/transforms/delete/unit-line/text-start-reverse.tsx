/** @jsx jsx */

import { cloneDeep } from 'lodash'
import { Transforms } from 'slate'

export const run = (editor) => {
  Transforms.delete(editor, { unit: 'line', reverse: true })
}
export const input = (
  <editor>
    <block>
      <cursor />
      one two three
    </block>
  </editor>
)
export const output = cloneDeep(input)
