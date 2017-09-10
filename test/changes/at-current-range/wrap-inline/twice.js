/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const text = texts.first()
  const range = selection.merge({
    anchorKey: text.key,
    anchorOffset: 7,
    focusKey: text.key,
    focusOffset: 11
  })

  change
    .select(range)
    .wrapInline('inner')
    .wrapInline('outer')

  const anchor = next.document.getTexts().get(2)
  const focus = next.document.getTexts().get(4)

  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
      anchorKey: anchor.key,
      anchorOffset: 0,
      focusKey: focus.key,
      focusOffset: 0
    }).toJS()
  )
}

export const input = (
  <state>
    <document>
      <paragraph>before word after</paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>before
        <outer>
          <inner>word</inner>
        </outer> after
      </paragraph>
    </document>
  </state>
)
