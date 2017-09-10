/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const third = document.getTexts().get(2)

  return state
    .change()
    .removeTextByKey(third.key, 0, 1)
}

export const input = (
  <state>
    <document>
      <paragraph>
        <image></image>a
        <link>two</link>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <image></image>
        <link>two</link>
      </paragraph>
    </document>
  </state>
)
