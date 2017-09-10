/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const last = texts.last()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 1,
    focusKey: last.key,
    focusOffset: last.text.length - 1
  })

  return state
    .change()
    .deleteAtRange(range)
}

export const input = (
  <state>
    <document>
      <paragraph>before
        <link>word</link>after
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>br</paragraph>
    </document>
  </state>
)
