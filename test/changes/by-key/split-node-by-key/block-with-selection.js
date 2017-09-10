/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const { selection } = state

  const range = selection.merge({
    anchorKey: 'b',
    anchorOffset: 0,
    focusKey: 'b',
    focusOffset: 3
  })

  change
    .select(range)
    .splitNodeByKey('a', 0)

  const second = next.document.getTexts().last()

  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
      focusKey: second.key,
      focusOffset: 3
    }).toJS()
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
      <x-paragraph></x-paragraph>
      <x-paragraph>word</x-paragraph>
    </document>
  </state>
)
