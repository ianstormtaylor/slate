/** @jsx h */

import h from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      <text />
      <element>
        on<mark>e</mark>
      </element>
      <text />
    </element>
  </value>
)

export const output = `
one
`.trim()
