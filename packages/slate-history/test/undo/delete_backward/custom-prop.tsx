/** @jsx jsx */

import { cloneDeep } from 'lodash'
import { Transforms } from 'slate'

export const run = (editor) => {
  Transforms.delete(editor)
}
export const input = (
  <editor>
    <block a>
      o<anchor />
      ne
    </block>
    <block b>
      tw
      <focus />o
    </block>
  </editor>
)
export const output = cloneDeep(input)
