/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: first.key,
    focusOffset: 2
  })

  return state
    .change()
    .addMarkAtRange(range, 'bold')
}

export const input = (
  <state>
    <document>
      <paragraph>
        <i>word</i>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <b>
          <i>wo</i>
        </b>
        <i>rd</i>
      </paragraph>
    </document>
  </state>
)
