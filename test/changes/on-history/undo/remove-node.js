/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  return state
    .change()
    .removeNodeByKey('key1')

    .change()
    .undo()
    .state
}

export const input = (
  <state>
    <document>
      <paragraph>The</paragraph>
      <paragraph>text</paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>The</paragraph>
      <paragraph>text</paragraph>
    </document>
  </state>
)
