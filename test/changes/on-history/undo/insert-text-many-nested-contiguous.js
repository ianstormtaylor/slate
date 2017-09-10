/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const second = texts.get(1)

  change
    .collapseToStartOf(second)
    .insertText('text')

    .change()
    .insertText('text')
    .state

    .change()
    .undo()
    .state
}

export const input = (
  <state>
    <document>
      <x-paragraph>paragraph one</x-paragraph>
      <x-paragraph>
        <x-list>list one</x-list>
        <x-list>list two</x-list>
      </x-paragraph>
      <x-paragraph>paragraph three</x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>paragraph one</x-paragraph>
      <x-paragraph>
        <x-list>list one</x-list>
        <x-list>list two</x-list>
      </x-paragraph>
      <x-paragraph>paragraph three</x-paragraph>
    </document>
  </state>
)
