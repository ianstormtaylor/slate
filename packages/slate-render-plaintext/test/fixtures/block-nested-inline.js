/** @jsx h */

import h from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      <element>
        <text />
        <element>one</element>
        <text />
      </element>
      <element>
        <text />
        <element>two</element>
        <text />
      </element>
    </element>
  </value>
)

export const output = `
one
two
`.trim()
