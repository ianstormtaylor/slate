/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: first.key,
    focusOffset: 0
  })

  change
    .select(range)
    .wrapText('[[', ']]')


  const updated = next.document.getTexts().get(0)

  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
      anchorKey: updated.key,
      anchorOffset: 2,
      focusKey: updated.key,
      focusOffset: 2,
      isBackward: false
    }).toJS()
  )
}

export const input = (
  <state>
    <document>
      <x-paragraph></x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>[[]]</x-paragraph>
    </document>
  </state>
)
