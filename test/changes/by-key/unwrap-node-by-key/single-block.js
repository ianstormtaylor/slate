/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  return state
    .change()
    .unwrapNodeByKey('to-unwrap')
}

export const input = (
  <state>
    <document>
      <quote>
        <paragraph>word</paragraph>
      </quote>
      <quote>
        <paragraph>word</paragraph>
      </quote>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>word</paragraph>
      <quote>
        <paragraph>word</paragraph>
      </quote>
    </document>
  </state>
)
