/** @jsx h */

import h from 'slate-hyperscript'

export const input = `
one
two
`.trim()

export const output = (
  <value>
    <element>one</element>
    <element>two</element>
  </value>
)
