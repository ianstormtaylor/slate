/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.splitNodeByKey('a', 2)
}

export const input = (
  <value>
    <document>
      <paragraph key="a">
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
        <link>one</link>
      </paragraph>
      <paragraph>
        <link>two</link>
      </paragraph>
    </document>
  </value>
)
