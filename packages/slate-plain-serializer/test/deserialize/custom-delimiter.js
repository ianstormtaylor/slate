/** @jsx h */

import h from '../helpers/h'

export const input = `
one
same paragraph

two
`.trim()

export const output = (
  <value>
    <document>
      <paragraph>one{'\n'}same paragraph</paragraph>
      <paragraph>two</paragraph>
    </document>
  </value>
)

export const options = {
  defaultBlock: 'paragraph',
  delimiter: '\n\n',
}
