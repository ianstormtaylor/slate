/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 1,
    focusKey: first.key,
    focusOffset: 1,
  })

  return state
    .change()
    .deleteCharForwardAtRange(range)
}

export const input = (
  <state>
    <document>
      <x-paragraph>one two three</x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>oe two three</x-paragraph>
    </document>
  </state>
)
