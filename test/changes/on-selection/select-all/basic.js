/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const { selection } = state

  change
    .selectAll(selection)

  const sel = selection.merge({
    anchorKey: '0',
    anchorOffset: 0,
    focusKey: '4',
    focusOffset: 5,
  })

  assert.deepEqual(
    next.selection.toJS(),
    sel.toJS()
  )
}

export const input = (
  <state>
    <document>
      <x-paragraph>one</x-paragraph>
      <x-paragraph>two</x-paragraph>
      <x-paragraph>three</x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>one</x-paragraph>
      <x-paragraph>two</x-paragraph>
      <x-paragraph>three</x-paragraph>
    </document>
  </state>
)
