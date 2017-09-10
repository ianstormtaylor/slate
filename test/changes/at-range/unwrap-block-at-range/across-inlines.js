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
    .unwrapBlockAtRange(range, 'quote')
}

export const input = (
  <state>
    <document>
      <x-quote>
        <x-paragraph>
          <x-link>word</x-link>
        </x-paragraph>
        <x-paragraph>
          <x-link>another</x-link>
        </x-paragraph>
      </x-quote>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>
        <x-link>word</x-link>
      </x-paragraph>
      <x-paragraph>
        <x-link>another</x-link>
      </x-paragraph>
    </document>
  </state>
)
