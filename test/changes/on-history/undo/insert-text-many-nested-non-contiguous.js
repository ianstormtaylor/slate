/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.get(0)
  const second = texts.get(1)
  const third = texts.get(2)
  const fourth = texts.get(3)

  change
    .collapseToStartOf(first)
    .insertText('text')

    .change()
    .collapseToStartOf(second)
    .insertText('text')
    .state

    .change()
    .collapseToStartOf(third)
    .insertText('text')
    .state

    .change()
    .collapseToStartOf(fourth)
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
      <x-paragraph>textparagraph one</x-paragraph>
      <x-paragraph>
        <x-list>textlist one</x-list>
        <x-list>textlist two</x-list>
      </x-paragraph>
      <x-paragraph>paragraph three</x-paragraph>
    </document>
  </state>
)
