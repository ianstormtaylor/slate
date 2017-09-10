/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  return state
    .change()
    .unwrapNodeByKey('to-unwrap')

    .change()
    .undo()
    .state
}

export const input = (
  <state>
    <document>
      <quote>
        <paragraph>word1</paragraph>
        <paragraph>word2</paragraph>
        <paragraph>word3</paragraph>
      </quote>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <quote>
        <paragraph>word1</paragraph>
        <paragraph>word2</paragraph>
        <paragraph>word3</paragraph>
      </quote>
    </document>
  </state>
)
