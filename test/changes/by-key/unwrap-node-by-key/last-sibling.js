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
        <paragraph>word1</paragraph>
        <paragraph>word2</paragraph>
      </quote>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <quote>
        <paragraph>word1</paragraph>
      </quote>
      <paragraph>word2</paragraph>
    </document>
  </state>
)
