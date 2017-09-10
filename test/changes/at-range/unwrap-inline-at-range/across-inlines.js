/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const second = texts.get(1)
  const thirteenth = texts.get(12)
  const range = selection.merge({
    anchorKey: second.key,
    anchorOffset: 2,
    focusKey: thirteenth.key,
    focusOffset: 2
  })

  return state
    .change()
    .unwrapInlineAtRange(range, 'hashtag')
}

export const input = (
  <state>
    <document>
      <x-paragraph>
        <x-link>wo</x-link>
        <x-hashtag>
          <x-link>rd</x-link>
        </x-hashtag>
        <x-hashtag>
          <x-link>an</x-link>
        </x-hashtag>
        <x-link>other</x-link>
      </x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>
        <x-link>wo</x-link>
        <x-link>rd</x-link>
        <x-link>an</x-link>
        <x-link>other</x-link>
      </x-paragraph>
    </document>
  </state>
)
