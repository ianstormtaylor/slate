/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const last = texts.last()
  const range = selection.merge({
    anchorKey: last.key,
    anchorOffset: last.text.length - 1,
    focusKey: last.key,
    focusOffset: last.text.length
  })

  return state
    .change()
    .deleteAtRange(range)
}

export const input = (
  <state>
    <document>
      <paragraph>one
        <link>two</link>a
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>one
        <link>two</link>
      </paragraph>
    </document>
  </state>
)
