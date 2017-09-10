/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const second = texts.get(1)
  const range = selection.merge({
    anchorKey: second.key,
    anchorOffset: 0,
    focusKey: second.key,
    focusOffset: 0
  })

  change
    .select(range)
    .splitBlock()

  const updated = next.document.getTexts().get(2)

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
      <paragraph>word</paragraph>
      <paragraph>
        <link href="website.com">hyperlink</link>word
      </paragraph>
    </document>
  </state>
)
