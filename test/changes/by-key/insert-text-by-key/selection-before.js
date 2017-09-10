/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const firstText = texts.first()

  const nextSelection = selection.merge({
    anchorKey: firstText.key,
    focusKey: firstText.key,
    anchorOffset: 2,
    focusOffset: 2
  })

  change
    .select(nextSelection)
    .insertTextByKey(firstText.key, 5, 'XX')

  assert.deepEqual(
    next.selection.toJS(),
    nextSelection.toJS()
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
      <paragraph>helloXX</paragraph>
    </document>
  </state>
)
