/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: first.key,
    focusOffset: 1
  })

  change
    .select(range)
    .delete()

  assert.deepEqual(
    next.selection.toJS(),
    {
      anchorKey: null,
      anchorOffset: 0,
      focusKey: null,
      focusOffset: 0,
      isBackward: false,
      isFocused: false,
      marks: null
    }
  )
}

export const input = (
  <state>
    <document>
      <x-image></x-image>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      
    </document>
  </state>
)
