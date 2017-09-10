/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const second = texts.last()
  const range = selection.merge({
    anchorKey: second.key,
    anchorOffset: 0,
    focusKey: second.key,
    focusOffset: 0
  })

  change
    .select(range)
    .deleteBackward()

  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
      anchorKey: first.key,
      anchorOffset: first.text.length,
      focusKey: first.key,
      focusOffset: first.text.length
    }).toJS()
  )
}

export const input = (
  <state>
    <document>
      <quote>
        <paragraph>word</paragraph>
        <paragraph>another</paragraph>
      </quote>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <quote>
        <paragraph>wordanother</paragraph>
      </quote>
    </document>
  </state>
)
