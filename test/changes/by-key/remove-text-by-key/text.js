/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const first = document.getTexts().first()

  return state
    .change()
    .removeTextByKey(first.key, 3, 1)
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
      <paragraph>wor</paragraph>
    </document>
  </state>
)
