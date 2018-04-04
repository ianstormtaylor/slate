/** @jsx h */

import h from '../helpers/h'

export const input = (
  <value>
    <document>
      <paragraph>one</paragraph>
      <paragraph />
      <paragraph>three</paragraph>
    </document>
  </value>
)

export const output = `
one

three
`.trim()
