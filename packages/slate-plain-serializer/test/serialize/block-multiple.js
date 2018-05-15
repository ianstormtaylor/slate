/** @jsx h */

import h from '../helpers/h'

export const input = (
  <value>
    <document>
      <paragraph>one</paragraph>
      <paragraph>two</paragraph>
      <paragraph>three</paragraph>
    </document>
  </value>
)

export const output = `
one
two
three
`.trim()
