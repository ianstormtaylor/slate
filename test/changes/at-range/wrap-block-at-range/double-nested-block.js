/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const { selection, document } = state
  const blocks = document.getBlocks()
  const range = selection.moveToRangeOf(blocks.first(), blocks.last())

  return state
    .change()
    .wrapBlockAtRange(range, 'bulleted-list')
}

export const input = (
  <state>
    <document>
      <x-list-item>
        <x-paragraph>word1</x-paragraph>
      </x-list-item>
      <x-list-item>
        <x-paragraph>word2</x-paragraph>
      </x-list-item>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-bulleted-list>
        <x-list-item>
          <x-paragraph>word1</x-paragraph>
        </x-list-item>
        <x-list-item>
          <x-paragraph>word2</x-paragraph>
        </x-list-item>
      </x-bulleted-list>
    </document>
  </state>
)
