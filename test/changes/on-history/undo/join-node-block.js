/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const { selection } = state

  change
    .mergeNodeByKey('key2')

    .change()
    .undo()
    .state

  assert.deepEqual(next.selection.toJS(), selection.toJS())
}

export const input = (
  <state>
    <document>
      <x-paragraph>The</x-paragraph>
      <x-paragraph>text</x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>The</x-paragraph>
      <x-paragraph>text</x-paragraph>
    </document>
  </state>
)
