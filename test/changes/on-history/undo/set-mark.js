/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const { selection } = state

  change
    .setMarkByKey('key1', 0, 8, 'mark', { type: 'newMarkType', data: { a: 1 }})

    .change()
    .undo()
    .state

  assert.deepEqual(next.selection.toJS(), selection.toJS())
}

export const input = (
  <state>
    <document>
      <x-paragraph>
        <x-m>The text</x-m>
      </x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>
        <x-m>The text</x-m>
      </x-paragraph>
    </document>
  </state>
)
