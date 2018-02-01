/** @jsx h */

import h from '../helpers/h'

export const input = (
  <value>
    <document>
      <quote>
        <paragraph>
          <link>one</link>
        </paragraph>
        <paragraph>
          <link>two</link>
        </paragraph>
      </quote>
    </document>
  </value>
)

export const output = `
one
two
`.trim()
