/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const second = texts.last()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: second.key,
    focusOffset: 0
  })

  change
    .select(range)
    .delete()

  assert.deepEqual(
    next.selection.toJS(),
    range.collapseToEnd().toJS()
  )
}

export const input = (
  <state>
    <document>
      <x-paragraph>one</x-paragraph>
      <x-quote>two</x-quote>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-quote>two</x-quote>
    </document>
  </state>
)
