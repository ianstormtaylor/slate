/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const last = texts.last()
  const range = selection.merge({
    anchorKey: last.key,
    anchorOffset: last.text.length - 1,
    focusKey: last.key,
    focusOffset: last.text.length
  })

  change
    .select(range)
    .delete()

  const updated = next.document.getTexts().last()

  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
      anchorKey: updated.key,
      anchorOffset: updated.text.length,
      focusKey: updated.key,
      focusOffset: updated.text.length
    }).toJS()
  )
}

export const input = (
  <state>
    <document>
      <paragraph>one
        <link>two</link>a
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>one
        <link>two</link>
      </paragraph>
    </document>
  </state>
)
