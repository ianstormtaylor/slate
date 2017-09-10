/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const { selection } = state

  change
    .addMarkByKey('a', 0, 8, 'marktype')

    .change()
    .undo()
    .state

  assert.deepEqual(next.selection.toJS(), selection.toJS())
}

export const input = (
  <state>
    <document>
      <x-paragraph>te
        <x-b>xt</x-b>
      </x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>te
        <x-b>xt</x-b>
      </x-paragraph>
    </document>
  </state>
)
