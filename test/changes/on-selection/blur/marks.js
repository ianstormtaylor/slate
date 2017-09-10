/** @jsx h */

import h from '../../../helpers/h'

import { Mark } from '../../../../../..'

export default function (change) {
  const { startText, selection } = state
  const sel = selection.merge({
    marks: Mark.createSet([
        Mark.create({
            type: 'bold'
        })
    ])
  })

  change
    .addMark('bold')
    .focus()
    .blur()

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
