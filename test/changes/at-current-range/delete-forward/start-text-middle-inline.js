/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.get(0)
  const second = texts.get(1)
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: second.key,
    focusOffset: 1
  })

  change
    .select(range)
    .deleteForward()

  // TODO: fix this behavior.
  /* const updated = next.document.getTexts().last()

  assert.deepEqual(
    next.selection.toJS(),
    range.collapseToEndOf(updated).toJS()
  ) */
}

export const input = (
  <state>
    <document>
      <x-paragraph>one
        <x-link>two</x-link>
      </x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>
        <x-link>wo</x-link>
      </x-paragraph>
    </document>
  </state>
)
