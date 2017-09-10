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
    .toggleMarkAtRange(range, 'bold')
}

export const input = (
  <state>
    <document>
      <paragraph>
        <b>word</b>
      </paragraph>
      <paragraph>
        <b>another</b>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <b>wo</b>rd
      </paragraph>
      <paragraph>an
        <b>other</b>
      </paragraph>
    </document>
  </state>
)
