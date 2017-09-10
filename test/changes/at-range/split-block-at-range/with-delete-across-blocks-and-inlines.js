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
      <x-paragraph>
        <x-one>word</x-one>
      </x-paragraph>
      <x-paragraph>
        <x-two>another</x-two>
      </x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>
        <x-one>wo</x-one>
      </x-paragraph>
      <x-paragraph>
        <x-two>other</x-two>
      </x-paragraph>
    </document>
  </state>
)
