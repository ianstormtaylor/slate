/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.get(0)
  const second = texts.get(1)
  const third = texts.get(2)
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: first.text.length,
    focusKey: second.key,
    focusOffset: 0
  })

  change
    .select(range)
    .delete()

  assert.deepEqual(
    next.selection.toJS(),
    range.collapseToStart().toJS()
  )
}

export const input = (
  <state>
    <document>
      <x-list>
        <x-item>one</x-item>
        <x-item>two</x-item>
        <x-item>three</x-item>
      </x-list>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-list>
        <x-item>onetwo</x-item>
        <x-item>three</x-item>
      </x-list>
    </document>
  </state>
)
