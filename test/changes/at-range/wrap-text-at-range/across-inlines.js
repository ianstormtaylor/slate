/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const second = texts.get(1)
  const fourth = texts.get(3)
  const range = selection.merge({
    anchorKey: second.key,
    anchorOffset: 2,
    focusKey: fourth.key,
    focusOffset: 2
  })

  return state
    .change()
    .wrapTextAtRange(range, '[[', ']]')
}

export const input = (
  <state>
    <document>
      <x-paragraph>
        <x-link>word</x-link>
        <x-link>another</x-link>
      </x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>
        <x-link>wo[[rd</x-link>
        <x-link>an]]other</x-link>
      </x-paragraph>
    </document>
  </state>
)
