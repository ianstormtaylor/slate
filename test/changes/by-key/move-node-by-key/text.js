/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const text = document.getTexts().last()
  const block = document.getBlocks().first()

  return state
    .change()
    .moveNodeByKey(text.key, block.key, 1)
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
      <paragraph>onetwo</paragraph>
      <paragraph></paragraph>
    </document>
  </state>
)
