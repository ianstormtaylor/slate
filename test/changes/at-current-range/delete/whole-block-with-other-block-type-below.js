/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const second = texts.get(1)
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: second.key,
    focusOffset: 0
  })

  change
    .select(range)
    .delete()

  const newFirst = next.document.getTexts().first()

  assert.deepEqual(
    next.selection.toJS(),
    {
      anchorKey: newFirst.key,
      anchorOffset: 0,
      focusKey: newFirst.key,
      focusOffset: 0,
      isBackward: false,
      isFocused: false,
      marks: null
    }
  )
}

export const input = (
  <state>
    <document>
      <x-h1>A header</x-h1>
      <x-paragraph>A paragraph</x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>A paragraph</x-paragraph>
    </document>
  </state>
)
