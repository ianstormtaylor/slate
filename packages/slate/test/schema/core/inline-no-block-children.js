/** @jsx h */

import h from '../../helpers/h'

export const schema = {}

export const input = (
  <value>
    <document>
      <paragraph>
        <text />
        <link>
          <paragraph>one</paragraph>
          two
        </link>
        <text />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <text />
        <link>two</link>
        <text />
      </paragraph>
    </document>
  </value>
)
