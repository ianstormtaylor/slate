/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: first.text.length - 1,
    focusKey: first.key,
    focusOffset: first.text.length
  })

  return state
    .change()
    .addMarkAtRange(range, 'bold')
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
      <paragraph>wor
        <b>d</b>
      </paragraph>
    </document>
  </state>
)
