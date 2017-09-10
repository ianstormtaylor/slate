/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: first.key,
    focusOffset: 0
  })

  return state
    .change()
    .setBlockAtRange(range, { type: 'code' })
}

export const input = (
  <state>
    <document>
      <x-paragraph>
        <x-paragraph>word</x-paragraph>
      </x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>
        <x-code>word</x-code>
      </x-paragraph>
    </document>
  </state>
)
