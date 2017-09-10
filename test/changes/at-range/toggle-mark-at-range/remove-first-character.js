/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: first.key,
    focusOffset: 1
  })

  return state
    .change()
    .toggleMarkAtRange(range, 'bold')
}

export const input = (
  <state>
    <document>
      <paragraph>
        <b>word</b>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>w
        <b>ord</b>
      </paragraph>
    </document>
  </state>
)
