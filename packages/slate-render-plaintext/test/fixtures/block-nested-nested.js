/** @jsx h */

import h from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      <element>
        <element>one</element>
        <element>two</element>
      </element>
      <element>
        <element>three</element>
        <element>four</element>
      </element>
    </element>
  </value>
)

export const output = `
one
two
three
four
`.trim()
