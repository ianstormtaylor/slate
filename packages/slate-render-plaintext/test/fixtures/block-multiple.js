/** @jsx h */

import h from 'slate-hyperscript'

export const input = (
  <value>
    <element>one</element>
    <element>two</element>
    <element>three</element>
  </value>
)

export const output = `
one
two
three
`.trim()
