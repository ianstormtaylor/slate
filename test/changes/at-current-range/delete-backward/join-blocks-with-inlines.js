/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.get(0)
  const second = texts.get(1)
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
      <paragraph>one</paragraph>
      <paragraph>two
        <link>three</link>four
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>onetwo
        <link>three</link>four
      </paragraph>
    </document>
  </state>
)
