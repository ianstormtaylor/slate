/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.moveNodeByKey('a', 'b', 1)
}

export const input = (
  <value>
    <document key="b">
      <paragraph key="a">
        <cursor />one
      </paragraph>
      <paragraph>two</paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>two</paragraph>
      <paragraph>
        <cursor />one
      </paragraph>
    </document>
  </value>
)
