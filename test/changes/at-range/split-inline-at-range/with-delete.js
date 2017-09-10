/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const second = texts.get(1)
  const range = selection.merge({
    anchorKey: second.key,
    anchorOffset: 1,
    focusKey: second.key,
    focusOffset: 3
  })

  return state
    .change()
    .splitInlineAtRange(range)
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
        <link>w</link>
        <link>d</link>
      </paragraph>
    </document>
  </state>
)
