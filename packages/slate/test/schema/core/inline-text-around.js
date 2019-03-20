/** @jsx h */

import h from '../../helpers/h'

export const schema = {}

export const input = (
  <value>
    <document>
      <paragraph>
        <link>one</link>
        <link>two</link>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <text />
        <link>one</link>
        <text />
        <link>two</link>
        <text />
      </paragraph>
    </document>
  </value>
)
