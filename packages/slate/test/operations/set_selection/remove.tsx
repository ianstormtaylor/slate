/** @jsx jsx */

import { jsx } from '../..'

jsx

import { Transforms } from 'slate'

export const input = (
  <editor>
    <element>
      a<cursor />
    </element>
  </editor>
)

Transforms.setSelection(input, { custom: 123 })

export const operations = [
  {
    type: 'set_selection',
    oldProperties: {},
    newProperties: { custom: null },
  },
]

export const output = (
  <editor>
    <element>
      a<cursor />
    </element>
  </editor>
)
