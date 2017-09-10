/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.get(0)
  const second = texts.get(1)
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: second.key,
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
      <x-paragraph>one</x-paragraph>
      <x-paragraph>two</x-paragraph>
      <x-quote>
        <x-paragraph>three</x-paragraph>
        <x-paragraph>four</x-paragraph>
        <x-paragraph>five</x-paragraph>
        <x-paragraph>six</x-paragraph>
      </x-quote>
    </document>
  </state>
)
