/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.removeNodeByKey('a')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <text />
        <link key="a">one</link>
        <text />
      </paragraph>
      <paragraph>two</paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <text />
      </paragraph>
      <paragraph>two</paragraph>
    </document>
  </value>
)
