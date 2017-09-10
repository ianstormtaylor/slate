/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const second = texts.get(1)
  const range = selection.merge({
    anchorKey: second.key,
    anchorOffset: 2,
    focusKey: second.key,
    focusOffset: 2
  })

  return state
    .change()
    .splitInlineAtRange(range)
}

export const input = (
  <state>
    <document>
      <x-paragraph>
        <x-link>
          <x-b>word</x-b>
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
          <x-b>wo</x-b>
        </x-link>
        <x-link>
          <x-b>rd</x-b>
        </x-link>
      </x-paragraph>
    </document>
  </state>
)
