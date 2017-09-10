/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const last = texts.last()
  const range = selection.merge({
    anchorKey: last.key,
    anchorOffset: 0,
    focusKey: last.key,
    focusOffset: 0
  })

  change
    .select(range)
    .deleteForward()

  const updated = next.document.getTexts().last()

  assert.deepEqual(
    next.selection.toJS(),
    range.collapseToEndOf(updated).toJS()
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
