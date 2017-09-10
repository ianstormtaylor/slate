/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 4,
    focusKey: first.key,
    focusOffset: 4
  })

  change
    .select(range)
    .toggleMark('bold')
    .insertText('s')

  assert.deepEqual(next.selection.toJS(), range.move(1).toJS())
}

export const input = (
  <state>
    <document>
      <x-paragraph>word</x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>word
        <x-b>s</x-b>
      </x-paragraph>
    </document>
  </state>
)
