/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const second = texts.get(1)
  const range = selection.merge({
    anchorKey: second.key,
    anchorOffset: second.text.length - 1,
    focusKey: second.key,
    focusOffset: second.text.length - 1
  })

  return state
    .change()
    .deleteCharBackwardAtRange(range)
}

export const input = (
  <state>
    <document>
      <x-paragraph>one
        <x-link>tw📛o</x-link>
      </x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>one
        <x-link>two</x-link>
      </x-paragraph>
    </document>
  </state>
)
