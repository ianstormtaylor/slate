/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const first = document.getInlines().first()

  return state
    .change()
    .setNodeByKey(first.key, {
      type: 'image',
      isVoid: true
    })
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
        <image></image>
      </paragraph>
    </document>
  </state>
)
