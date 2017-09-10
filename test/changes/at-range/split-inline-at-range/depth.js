/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const third = texts.get(2)
  const range = selection.merge({
    anchorKey: third.key,
    anchorOffset: 2,
    focusKey: third.key,
    focusOffset: 2
  })

  return state
    .change()
    .splitInlineAtRange(range, 1)
}

export const input = (
  <state>
    <document>
      <x-paragraph>
        <x-link>
          <x-link>word</x-link>
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
          <x-link>wo</x-link>
          <x-link>rd</x-link>
        </x-link>
      </x-paragraph>
    </document>
  </state>
)
