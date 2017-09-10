/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: first.text.length,
    focusKey: first.key,
    focusOffset: first.text.length
  })

  return state
    .change()
    .insertBlockAtRange(range, 'image')
}

export const input = (
  <state>
    <document>
      <paragraph>word</paragraph>
      <paragraph>word</paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>word</paragraph>
      <image></image>
      <paragraph>word</paragraph>
    </document>
  </state>
)
