/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const third = texts.get(2)
  const fourth = texts.get(3)
  const range = selection.merge({
    anchorKey: third.key,
    anchorOffset: 0,
    focusKey: fourth.key,
    focusOffset: 0
  })

  change
    .select(range)
    .unwrapBlock('quote')

  const updated = next.document.getTexts().get(2)

  assert.deepEqual(
    next.selection.toJS(),
    range.merge({ anchorKey: updated.key }).toJS()
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
      </x-quote>
      <x-paragraph>three</x-paragraph>
      <x-paragraph>four</x-paragraph>
      <x-quote>
        <x-paragraph>five</x-paragraph>
        <x-paragraph>six</x-paragraph>
      </x-quote>
    </document>
  </state>
)
