/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.removeNodeByKey('a')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <link key="a">one</link>
      </paragraph>
      <paragraph>two</paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph />
      <paragraph>two</paragraph>
    </document>
  </value>
)
