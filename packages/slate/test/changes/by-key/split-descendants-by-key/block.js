/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.splitDescendantsByKey('a', 'b', 2)
}

export const input = (
  <value>
    <document>
      <paragraph key="a">
        <text key="b">word</text>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>wo</paragraph>
      <paragraph>rd</paragraph>
    </document>
  </value>
)
