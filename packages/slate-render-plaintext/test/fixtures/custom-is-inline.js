/** @jsx h */

import h from 'slate-hyperscript'

export const input = (
  <value>
    <element>one{'\n'}same paragraph</element>
    <element>two</element>
    <element>three</element>
  </value>
)

export const options = {
  isInline: () => true,
}

export const output = `
one
same paragraphtwothree
`.trim()
