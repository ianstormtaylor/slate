/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const firstText = texts.first()

  const nextSelection = selection.merge({
    anchorKey: firstText.key,
    focusKey: firstText.key,
    anchorOffset: 2,
    focusOffset: 2
  })

  change
    .select(nextSelection)
    .removeTextByKey(firstText.key, 3, 1)

  assert.deepEqual(
    next.selection.toJS(),
    nextSelection.merge({
      anchorOffset: 2,
      focusOffset: 2
    }).toJS()
  )
}

export const input = (
  <state>
    <document>
      <x-paragraph>hello</x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>helo</x-paragraph>
    </document>
  </state>
)
