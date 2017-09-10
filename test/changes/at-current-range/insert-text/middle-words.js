/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 1,
    focusKey: first.key,
    focusOffset: 1
  })

  change
    .select(range)
    .insertText(' a few words ')

  assert.deepEqual(
    next.selection.toJS(),
    range.move(13).toJS()
  )
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
      <x-paragraph>w a few words ord</x-paragraph>
    </document>
  </state>
)
