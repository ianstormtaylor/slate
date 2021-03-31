/** @jsx jsx */
import { jsx } from 'slate-hyperscript'
import { Transforms, Editor } from 'slate'

export const input = (
  <editor>
    <element>
      a<cursor />
    </element>
  </editor>
)

export const operations = [
  {
    type: 'set_selection',
    oldProperties: {},
    newProperties: { custom: 123 },
  },
]

export const output = (
  <editor>
    <element>
      a<cursor />
    </element>
  </editor>
)

Transforms.setSelection(output, { custom: 123 })
