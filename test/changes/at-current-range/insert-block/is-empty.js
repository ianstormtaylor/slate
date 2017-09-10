/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: first.key,
    focusOffset: 0
  })

  change
    .select(range)
    .insertBlock('image')

  const updated = next.document.getTexts().first()

  assert.deepEqual(
    next.selection.toJS(),
    range.collapseToStartOf(updated).toJS()
  )
}

export const input = (
  <state>
    <document>
      <paragraph></paragraph>
      <paragraph>not empty</paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <image></image>
      <paragraph>not empty</paragraph>
    </document>
  </state>
)
