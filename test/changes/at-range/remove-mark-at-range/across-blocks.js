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
    .removeMarkAtRange(range, 'bold')
}

export const input = (
  <state>
    <document>
      <x-paragraph>
        <x-b>word</x-b>
      </x-paragraph>
      <x-paragraph>
        <x-b>another</x-b>
      </x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>
        <x-b>wo</x-b>rd
      </x-paragraph>
      <x-paragraph>an
        <x-b>other</x-b>
      </x-paragraph>
    </document>
  </state>
)
