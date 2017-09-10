/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change
    .splitDescendantsByKey('a', 'b', 2)
}

export const input = (
  <state>
    <document>
      <paragraph>word</paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>wo</paragraph>
      <paragraph>rd</paragraph>
    </document>
  </state>
)
