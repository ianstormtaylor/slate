/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.deleteNodesBetween('a', 'b')
}

export const input = (
  <value>
    <document>
      <quote>
        <paragraph key="a">word</paragraph>
        <paragraph key="b">another</paragraph>
      </quote>
      <paragraph />
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph />
    </document>
  </value>
)
