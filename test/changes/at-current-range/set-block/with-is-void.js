/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  let first = document.getTexts().first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: first.key,
    focusOffset: 0
  })

  change
    .select(range)
    .setBlock({
      type: 'image',
      isVoid: true
    })

  // Selection is reset, in theory it should me on the image
  first = next.document.getTexts().first()
  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
        anchorKey: first.key,
        anchorOffset: 0,
        focusKey: first.key,
        focusOffset: 0
    }).toJS()
  )
}

export const input = (
  <state>
    <document>
      <paragraph>word</paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <image></image>
    </document>
  </state>
)
