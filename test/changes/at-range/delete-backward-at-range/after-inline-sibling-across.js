/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const last = texts.last()
  const range = selection.merge({
    anchorKey: last.key,
    anchorOffset: last.text.length,
    focusKey: last.key,
    focusOffset: last.text.length
  })

  return state
    .change()
    .deleteBackwardAtRange(range)
}

export const input = (
  <state>
    <document>
      <paragraph>one
        <link>two</link>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>one
        <link>tw</link>
      </paragraph>
    </document>
  </state>
)
