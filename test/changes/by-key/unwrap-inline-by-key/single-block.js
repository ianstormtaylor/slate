/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const inline = document.assertPath([0, 1])

  change
    .unwrapInlineByKey(inline.key, 'hashtag')
}

export const input = (
  <state>
    <document>
      <x-paragraph>w
        <x-hashtag>or</x-hashtag>d
        <x-hashtag>another</x-hashtag>
      </x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>word
        <x-hashtag>another</x-hashtag>
      </x-paragraph>
    </document>
  </state>
)
