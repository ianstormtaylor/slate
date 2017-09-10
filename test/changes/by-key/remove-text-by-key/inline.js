/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const second = document.getTexts().get(1)

  return state
    .change()
    .removeTextByKey(second.key, 3, 1)
}

export const input = (
  <state>
    <document>
      <paragraph>
        <link>word</link>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <link>wor</link>
      </paragraph>
    </document>
  </state>
)
