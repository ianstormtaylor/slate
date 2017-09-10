/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const first = document.getBlocks().first()

  return state
    .change()
    .moveNodeByKey(first.key, document.key, 1)
}

export const input = (
  <state>
    <document>
      <paragraph>one</paragraph>
      <paragraph>two</paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>two</paragraph>
      <paragraph>one</paragraph>
    </document>
  </state>
)
