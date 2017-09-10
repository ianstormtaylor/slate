/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const { selection } = state

  const t1 = state
    .change()
    .moveNodeByKey('d', 'a', 0)

  const s1 = t1

  const t2 = s1
    .change()
    .undo()

  const next = t2
    .state

  assert.deepEqual(next.selection.toJS(), selection.toJS())
}

export const input = (
  <state>
    <document>
      <x-quote>
        <x-paragraph>The</x-paragraph>
      </x-quote>
      <x-paragraph>text</x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-quote>
        <x-paragraph>The</x-paragraph>
      </x-quote>
      <x-paragraph>text</x-paragraph>
    </document>
  </state>
)
