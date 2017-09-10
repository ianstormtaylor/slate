/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const third = texts.get(2)
  const range = selection.merge({
    anchorKey: third.key,
    anchorOffset: 0,
    focusKey: third.key,
    focusOffset: 0
  })

  return state
    .change()
    .setInlineAtRange(range, { type: 'code' })
}

export const input = (
  <state>
    <document>
      <x-paragraph>
        <x-hashtag>
          <x-link>word</x-link>
        </x-hashtag>
      </x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>
        <x-hashtag>
          <x-code>word</x-code>
        </x-hashtag>
      </x-paragraph>
    </document>
  </state>
)
