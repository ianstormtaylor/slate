/** @jsx h */

import h from 'slate-hyperscript'

export const input = `
one
two
`.trim()

export const options = {
  textProps: { marks: [{ type: 'bold' }] },
}

export const output = (
  <value>
    <element>
      <mark type="bold">one</mark>
    </element>
    <element>
      <mark type="bold">two</mark>
    </element>
  </value>
)
