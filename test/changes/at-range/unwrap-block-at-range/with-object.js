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
    .unwrapBlockAtRange(range, {
      type: 'quote',
      data: { key: 'value' }
    })
}

export const input = (
  <state>
    <document>
      <quote>
        <paragraph>word</paragraph>
      </quote>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>word</paragraph>
    </document>
  </state>
)
