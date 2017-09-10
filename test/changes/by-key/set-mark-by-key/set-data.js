/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const first = document.getTexts().first()

  return state
    .change()
    .setMarkByKey(
      first.key,
      0,
      first.text.length,
      {
        type: 'bold',
        data: { key: true }
      },
      {
        data: { key: false }
      }
    )
}

export const input = (
  <state>
    <document>
      <paragraph>
        <b>word</b>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <b>word</b>
      </paragraph>
    </document>
  </state>
)
