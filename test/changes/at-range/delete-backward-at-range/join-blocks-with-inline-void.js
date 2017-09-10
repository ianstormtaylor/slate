/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const last = texts.last()
  const range = selection.merge({
    anchorKey: last.key,
    anchorOffset: 0,
    focusKey: last.key,
    focusOffset: 0
  })

  return state
    .change()
    .deleteBackwardAtRange(range)
}

export const input = (
  <state>
    <document>
      <paragraph>
        <emoji></emoji>
      </paragraph>
      <paragraph></paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <emoji></emoji>
      </paragraph>
    </document>
  </state>
)
