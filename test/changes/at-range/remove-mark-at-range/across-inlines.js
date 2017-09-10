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
    .removeMarkAtRange(range, 'bold')
}

export const input = (
  <state>
    <document>
      <x-paragraph>
        <x-link>
          <x-b>word</x-b>
        </x-link>
      </x-paragraph>
      <x-paragraph>
        <x-link>
          <x-b>another</x-b>
        </x-link>
      </x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>
        <x-link>
          <x-b>wo</x-b>rd
        </x-link>
      </x-paragraph>
      <x-paragraph>
        <x-link>an
          <x-b>other</x-b>
        </x-link>
      </x-paragraph>
    </document>
  </state>
)
