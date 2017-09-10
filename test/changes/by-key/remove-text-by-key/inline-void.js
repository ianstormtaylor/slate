/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const last = document.getTexts().last()

  return state
    .change()
    .removeTextByKey(last.key, 0, 4)
}

export const input = (
  <state>
    <document>
      <paragraph>
        <image></image>word
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <image></image>
      </paragraph>
    </document>
  </state>
)
