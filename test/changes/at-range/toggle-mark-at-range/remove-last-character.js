/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: first.text.length - 1,
    focusKey: first.key,
    focusOffset: first.text.length
  })

  return state
    .change()
    .toggleMarkAtRange(range, 'bold')
}

export const input = (
  <state>
    <document>
      <x-paragraph>
        <x-b>word</x-b>
      </x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>
        <x-b>wor</x-b>d
      </x-paragraph>
    </document>
  </state>
)
