/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const second = texts.last()
  const range = selection.merge({
    anchorKey: second.key,
    anchorOffset: 0,
    focusKey: second.key,
    focusOffset: 0
  })

  return state
    .change()
    .deleteBackwardAtRange(range)
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
