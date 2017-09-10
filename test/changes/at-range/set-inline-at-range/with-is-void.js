/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const second = texts.get(1)
  const range = selection.merge({
    anchorKey: second.key,
    anchorOffset: 0,
    focusKey: second.key,
    focusOffset: 0
  })

  return state
    .change()
    .setInlineAtRange(range, {
      type: 'emoji',
      isVoid: true
    })
}

export const input = (
  <state>
    <document>
      <x-paragraph>
        <x-link>word</x-link>
      </x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>
        <x-emoji></x-emoji>
      </x-paragraph>
    </document>
  </state>
)
