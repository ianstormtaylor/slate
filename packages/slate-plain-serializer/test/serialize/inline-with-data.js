/** @jsx h */

import h from '../helpers/h'

export const input = (
  <value>
    <document>
      <paragraph>
        <link thing="value">one</link>
      </paragraph>
    </document>
  </value>
)

export const output = `
one
`.trim()
