/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const { selection } = state
  const range = selection.merge({
    anchorKey: 'anchor',
    anchorOffset: 2,
    focusKey: 'focus',
    focusOffset: 2
  })

  change
    .select(range)
    .unwrapInline('hashtag')

  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
      focusKey: 'anchor',
      focusOffset: 5
    }).toJS()
  )
}

export const input = (
  <state>
    <document>
      <x-paragraph>he
        <x-hashtag>ll</x-hashtag>o w
        <x-hashtag>or</x-hashtag>d
      </x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>he
        <x-hashtag>ll</x-hashtag>o word
      </x-paragraph>
    </document>
  </state>
)
