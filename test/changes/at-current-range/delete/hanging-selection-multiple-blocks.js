/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const third = texts.last()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: third.key,
    focusOffset: 0
  })

  change
    .select(range)
    .delete()

  assert.deepEqual(
    next.selection.toJS(),
    range.collapseToEnd().toJS()
  )
}

export const input = (
  <state>
    <document>
      <paragraph>one</paragraph>
      <paragraph>two</paragraph>
      <quote>three</quote>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <quote>three</quote>
    </document>
  </state>
)
