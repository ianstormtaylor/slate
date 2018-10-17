/** @jsx h */

import h from '../helpers/h'

export const input = (
  <value>
    <document>
      <paragraph>one{'\n'}same paragraph</paragraph>
      <paragraph>two</paragraph>
      <paragraph>three</paragraph>
    </document>
  </value>
)

export const output = `
one
same paragraph

two

three
`.trim()

export const options = {
  delimiter: '\n\n',
}
