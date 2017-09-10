/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const last = texts.last()
  const range = selection.merge({
    anchorKey: last.key,
    anchorOffset: last.text.length - 2,
    focusKey: last.key,
    focusOffset: last.text.length - 2
  })

  return state
    .change()
    .deleteCharBackwardAtRange(range)
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
      <x-paragraph>one two thee</x-paragraph>
    </document>
  </state>
)
