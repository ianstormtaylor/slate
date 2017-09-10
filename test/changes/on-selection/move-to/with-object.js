/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const { startText, selection } = state
  const props = {
    anchorKey: startText.key,
    anchorOffset: 0,
    focusKey: startText.key,
    focusOffset: startText.text.length,
  }

  const sel = selection.merge(props)
  change
    .select(props)

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
