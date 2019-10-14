/** @jsx h */

import h from 'slate-hyperscript'

export const input = (
  <value>
    <element>one</element>
    <element />
    <element />
    <element>four</element>
  </value>
)

export const output = `
one


four
`.trim()
