/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.deleteNodesBetween('a', 'b')
}

export const input = (
  <value>
    <document>
      <paragraph key="a">word</paragraph>
      <paragraph key="b">another</paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document />
  </value>
)
