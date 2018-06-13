/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.removeNodeByKey('a')
}

export const input = (
  <value>
    <document>
      <paragraph>one</paragraph>
      <paragraph key="a">two</paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>one</paragraph>
    </document>
  </value>
)
