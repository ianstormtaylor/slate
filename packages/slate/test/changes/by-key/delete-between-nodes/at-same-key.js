/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.deleteNodesBetween('a', 'a')
}

export const input = (
  <value>
    <document>
      <paragraph key="a">word</paragraph>
      <paragraph>another</paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>another</paragraph>
    </document>
  </value>
)
