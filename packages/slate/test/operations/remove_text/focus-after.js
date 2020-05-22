/** @jsx jsx */

import { OperationType } from 'slate'
import { jsx } from 'slate-hyperscript'

export const input = (
  <editor>
    <element>
      <anchor />
      wor
      <focus />d
    </element>
  </editor>
)

export const operations = [
  {
    type: OperationType.RemoveText,
    path: [0, 0],
    offset: 1,
    text: 'or',
  },
]

export const output = (
  <editor>
    <element>
      <anchor />w<focus />d
    </element>
  </editor>
)
