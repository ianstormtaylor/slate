/** @jsx h */

import h from '../helpers/h'

export const input = (
  <value>
    <document>
      <quote>
        <paragraph>one</paragraph>
        <paragraph>two</paragraph>
      </quote>
      <quote>
        <paragraph />
        <paragraph>four</paragraph>
      </quote>
    </document>
  </value>
)

export const output = `
one
two

four
`.trim()
