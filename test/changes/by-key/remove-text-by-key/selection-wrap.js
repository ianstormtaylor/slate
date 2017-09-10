/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const firstText = texts.first()

  const nextSelection = selection.merge({
    anchorKey: firstText.key,
    focusKey: firstText.key,
    anchorOffset: 1,
    focusOffset: 5
  })

  change
    .select(nextSelection)
    .removeTextByKey(firstText.key, 2, 1)

  assert.deepEqual(
    next.selection.toJS(),
    nextSelection.merge({
      anchorOffset: 1,
      focusOffset: 4
    }).toJS()
  )
}

export const input = (
  <state>
    <document>
      <paragraph>hello</paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>helo</paragraph>
    </document>
  </state>
)
