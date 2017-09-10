/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: first.text.length,
    focusKey: first.key,
    focusOffset: first.text.length
  })

  change
    .select(range)
    .deleteForward()

  assert.deepEqual(
    next.selection.toJS(),
    range.collapseToStart().toJS()
  )
}

export const input = (
  <state>
    <document>
      <x-quote>
        <x-paragraph>word</x-paragraph>
        <x-paragraph>another</x-paragraph>
      </x-quote>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-quote>
        <x-paragraph>wordanother</x-paragraph>
      </x-quote>
    </document>
  </state>
)
