/** @jsx h */

import h from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      <text />
      <element>one</element>
      <text />
    </element>
  </value>
)

export const output = `
one
`.trim()
