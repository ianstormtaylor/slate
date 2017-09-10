/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const fifth = texts.get(4)
  const sixth = texts.get(5)
  const range = selection.merge({
    anchorKey: fifth.key,
    anchorOffset: 0,
    focusKey: sixth.key,
    focusOffset: 0
  })

  change
    .select(range)
    .unwrapBlock('quote')

  assert.deepEqual(
    next.selection.toJS(),
    range.toJS()
  )
}

export const input = (
  <state>
    <document>
      <x-quote>
        <x-paragraph>one</x-paragraph>
        <x-paragraph>two</x-paragraph>
        <x-paragraph>three</x-paragraph>
        <x-paragraph>four</x-paragraph>
        <x-paragraph>five</x-paragraph>
        <x-paragraph>six</x-paragraph>
      </x-quote>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-quote>
        <x-paragraph>one</x-paragraph>
        <x-paragraph>two</x-paragraph>
        <x-paragraph>three</x-paragraph>
        <x-paragraph>four</x-paragraph>
      </x-quote>
      <x-paragraph>five</x-paragraph>
      <x-paragraph>six</x-paragraph>
    </document>
  </state>
)
