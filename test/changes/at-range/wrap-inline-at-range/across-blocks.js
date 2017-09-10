/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const second = texts.last()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 2,
    focusKey: second.key,
    focusOffset: 2
  })

  return state
    .change()
    .wrapInlineAtRange(range, 'hashtag')
}

export const input = (
  <state>
    <document>
      <x-paragraph>word</x-paragraph>
      <x-paragraph>another</x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>wo
        <x-hashtag>rd</x-hashtag>
      </x-paragraph>
      <x-paragraph>
        <x-hashtag>an</x-hashtag>other
      </x-paragraph>
    </document>
  </state>
)
