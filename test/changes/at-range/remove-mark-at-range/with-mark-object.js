/** @jsx h */

import h from '../../../helpers/h'

import { Mark } from '../../../../../..'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: first.key,
    focusOffset: 1
  })

  return state
    .change()
    .removeMarkAtRange(range, Mark.create({
      type: 'bold',
      data: { key: 'value' }
    }))
}

export const input = (
  <state>
    <document>
      <x-paragraph>
        <x-b>w</x-b>ord
      </x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>word</x-paragraph>
    </document>
  </state>
)
