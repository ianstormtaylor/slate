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
    .deleteWordBackwardAtRange(range)
}

export const input = (
  <state>
    <document>
      <x-paragraph>one
        <x-link>tw📛o</x-link>
      </x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph></x-paragraph>
    </document>
  </state>
)
