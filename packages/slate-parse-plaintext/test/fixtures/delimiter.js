/** @jsx h */

import h from 'slate-hyperscript'

export const input = `
one
same paragraph

two
`.trim()

export const options = {
  delimiter: '\n\n',
}

export const output = (
  <value>
    <element>one{'\n'}same paragraph</element>
    <element>two</element>
  </value>
)
