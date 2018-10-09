/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.moveNodeByKey('a', 'b', 1)
}

export const input = (
  <value>
    <document>
      <paragraph key="a">
        <cursor />one
      </paragraph>
      <quote key="b">
        <paragraph>two</paragraph>
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <paragraph>two</paragraph>
        <paragraph>
          <cursor />one
        </paragraph>
      </quote>
    </document>
  </value>
)
