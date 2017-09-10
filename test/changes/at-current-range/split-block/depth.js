/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 2,
    focusKey: first.key,
    focusOffset: 2
  })

  change
    .select(range)
    .splitBlock(Infinity)

  const updated = next.document.getTexts().last()

  assert.deepEqual(
    next.selection.toJS(),
    range.collapseToStartOf(updated).toJS()
  )
}

export const input = (
  <state>
    <document>
      <x-paragraph>
        <x-paragraph>
          <x-paragraph>word</x-paragraph>
        </x-paragraph>
      </x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>
        <x-paragraph>
          <x-paragraph>wo</x-paragraph>
        </x-paragraph>
      </x-paragraph>
      <x-paragraph>
        <x-paragraph>
          <x-paragraph>rd</x-paragraph>
        </x-paragraph>
      </x-paragraph>
    </document>
  </state>
)
