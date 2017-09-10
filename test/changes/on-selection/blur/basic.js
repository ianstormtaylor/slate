/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const { startText, selection } = state

  change
    .focus()
    .blur()

  assert.deepEqual(
    next.selection.toJS(),
    selection.toJS()
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
