/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const firstText = texts.first()
  const secondText = texts.get(1)

  const nextSelection = selection.merge({
    anchorKey: secondText.key,
    focusKey: secondText.key,
    anchorOffset: 2,
    focusOffset: 2
  })

  change
    .select(nextSelection)
    .removeNodeByKey('todelete')

  assert.deepEqual(
    next.selection.toJS(),
    nextSelection.merge({
      anchorKey: firstText.key,
      focusKey: firstText.key,
      anchorOffset: 5,
      focusOffset: 5
    }).toJS()
  )
}

export const input = (
  <state>
    <document>
      <x-paragraph>hello</x-paragraph>
      <x-paragraph>removed</x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>hello</x-paragraph>
    </document>
  </state>
)
