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
    .deleteForwardAtRange(range)
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
      <quote>
        <paragraph>wordanother</paragraph>
      </quote>
    </document>
  </state>
)
