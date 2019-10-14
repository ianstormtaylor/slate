/** @jsx h */

import h from 'slate-hyperscript'

export const input = `
one
two
`.trim()

export const options = {
  elementProps: { type: 'paragraph' },
}

export const output = (
  <value>
    <element type="paragraph">one</element>
    <element type="paragraph">two</element>
  </value>
)
