/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const second = texts.get(1)
  const fifth = texts.get(4)
  const range = selection.merge({
    anchorKey: second.key,
    anchorOffset: 2,
    focusKey: fifth.key,
    focusOffset: 2
  })

  return state
    .change()
    .splitBlockAtRange(range)
}

export const input = (
  <state>
    <document>
      <paragraph>
        <one>word</one>
      </paragraph>
      <paragraph>
        <two>another</two>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <one>wo</one>
      </paragraph>
      <paragraph>
        <two>other</two>
      </paragraph>
    </document>
  </state>
)
