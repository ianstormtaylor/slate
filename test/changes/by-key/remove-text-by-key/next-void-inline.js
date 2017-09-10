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
        <link>one</link>a
        <image></image>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <link>one</link>
        <image></image>
      </paragraph>
    </document>
  </state>
)
