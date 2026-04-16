/** @jsx jsx */

import { cloneDeep } from 'lodash'
import { Transforms } from 'slate'

export const run = (editor) => {
  Transforms.delete(editor, { unit: 'line' })
}
export const input = (
  <editor>
    <block>
      one two three
      <cursor />
    </block>
  </editor>
)
export const output = cloneDeep(input)
