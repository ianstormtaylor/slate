/** @jsx h */

import h from '../../helpers/h'

export const schema = {}

export const input = (
  <value>
    <document>
      <quote>
        <text />
        <link>one</link>
        <text />
        <paragraph>two</paragraph>
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <text />
        <link>one</link>
        <text />
      </quote>
    </document>
  </value>
)
