/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const secondText = texts.get(1)

  const nextSelection = selection.merge({
    anchorKey: secondText.key,
    focusKey: secondText.key,
    anchorOffset: 0,
    focusOffset: 0
  })

  change
    .select(nextSelection)
    .removeNodeByKey('todelete')

  assert.deepEqual(
    next.selection.toJS(),
    nextSelection.toJS()
  )
}

export const input = (
  <state>
    <document>
      <x-paragraph>removed</x-paragraph>
      <x-paragraph>hello</x-paragraph>
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
