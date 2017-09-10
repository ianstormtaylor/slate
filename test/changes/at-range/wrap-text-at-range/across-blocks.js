/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const last = texts.last()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 2,
    focusKey: last.key,
    focusOffset: 2
  })

  return state
    .change()
    .wrapTextAtRange(range, '[[', ']]')
}

export const input = (
  <state>
    <document>
      <paragraph>word</paragraph>
      <paragraph>another</paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>wo[[rd</paragraph>
      <paragraph>an]]other</paragraph>
    </document>
  </state>
)
