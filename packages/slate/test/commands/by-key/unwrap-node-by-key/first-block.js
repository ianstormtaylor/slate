/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.unwrapNodeByKey('a')
}

export const input = (
  <value>
    <document>
      <quote>
        <paragraph key="a">one</paragraph>
        <paragraph>two</paragraph>
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>one</paragraph>
      <quote>
        <paragraph>two</paragraph>
      </quote>
    </document>
  </value>
)
