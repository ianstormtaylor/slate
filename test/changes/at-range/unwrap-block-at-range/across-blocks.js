/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const second = texts.last()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 2,
    focusKey: second.key,
    focusOffset: 2
  })

  return state
    .change()
    .unwrapBlockAtRange(range, 'quote')
}

export const input = (
  <state>
    <document>
      <quote>
        <paragraph>word</paragraph>
        <paragraph>another</paragraph>
      </quote>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>word</paragraph>
      <paragraph>another</paragraph>
    </document>
  </state>
)
