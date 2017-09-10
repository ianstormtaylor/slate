/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const third = texts.get(2)
  const range = selection.merge({
    anchorKey: third.key,
    anchorOffset: 0,
    focusKey: third.key,
    focusOffset: 0
  })

  change
    .select(range)
    .splitBlock()

  const updated = next.document.getTexts().get(3)

  assert.deepEqual(
    next.selection.toJS(),
    range.collapseToStartOf(updated).toJS()
  )
}

export const input = (
  <state>
    <document>
      <paragraph>word
        <link href="website.com">hyperlink</link>word
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>word
        <link href="website.com">hyperlink</link>
      </paragraph>
      <paragraph>word</paragraph>
    </document>
  </state>
)
