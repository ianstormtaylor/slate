/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.unwrapNodeByKey('a')
}

export const input = (
  <value>
    <document>
      <quote>
        <paragraph>one</paragraph>
        <paragraph key="a">two</paragraph>
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <paragraph>one</paragraph>
      </quote>
      <paragraph>two</paragraph>
    </document>
  </value>
)
