/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 1,
    focusKey: first.key,
    focusOffset: 3
  })

  return state
    .change()
    .wrapInlineAtRange(range, 'hashtag')
}

export const input = (
  <state>
    <document>
      <x-quote>
        <x-paragraph>word</x-paragraph>
      </x-quote>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-quote>
        <x-paragraph>w
          <x-hashtag>or</x-hashtag>d
        </x-paragraph>
      </x-quote>
    </document>
  </state>
)
