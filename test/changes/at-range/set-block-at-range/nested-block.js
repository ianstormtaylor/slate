/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: first.key,
    focusOffset: 0
  })

  return state
    .change()
    .setBlockAtRange(range, { type: 'code' })
}

export const input = (
  <state>
    <document>
      <paragraph>
        <paragraph>word</paragraph>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <code>word</code>
      </paragraph>
    </document>
  </state>
)
