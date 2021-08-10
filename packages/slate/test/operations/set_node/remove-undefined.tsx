/** @jsx jsx */
import { jsx } from 'slate-hyperscript'
import { Transforms, Editor } from 'slate'

export const input = (
  <editor>
    <element>
      <text key />
    </element>
  </editor>
)

// this is supported for backwards compatibility only; newProperties should omit removed values.
export const operations = [
  {
    type: 'set_node',
    path: [0, 0],
    properties: { key: true },
    newProperties: { key: undefined },
  },
]

export const output = (
  <editor>
    <element>
      <text />
    </element>
  </editor>
)
