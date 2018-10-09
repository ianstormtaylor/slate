/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.mergeNodeByKey('a')
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
      <paragraph>onetwo</paragraph>
    </document>
  </value>
)
