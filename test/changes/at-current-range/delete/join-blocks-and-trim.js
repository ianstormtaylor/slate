/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const second = texts.last()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 2,
    focusKey: second.key,
    focusOffset: 2
  })

  change
    .select(range)
    .delete()

  assert.deepEqual(
    next.selection.toJS(),
    range.collapseToStart().toJS()
  )
}

export const input = (
  <state>
    <document>
      <paragraph>word</paragraph>
      <paragraph>another</paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>woother</paragraph>
    </document>
  </state>
)
