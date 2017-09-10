/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const second = document.getTexts().get(1)

  return state
    .change()
    .removeTextByKey(second.key, 0, 1)
}

export const input = (
  <state>
    <document>
      <paragraph>
        <link>a</link>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph></paragraph>
    </document>
  </state>
)
