/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.get(0)
  const second = texts.get(1)
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: second.key,
    focusOffset: 0
  })

  change
    .select(range)
    .unwrapBlock('quote')

  assert.deepEqual(
    next.selection.toJS(),
    range.toJS()
  )
}

export const input = (
  <state>
    <document>
      <quote>
        <paragraph>one</paragraph>
        <paragraph>two</paragraph>
        <paragraph>three</paragraph>
        <paragraph>four</paragraph>
        <paragraph>five</paragraph>
        <paragraph>six</paragraph>
      </quote>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>one</paragraph>
      <paragraph>two</paragraph>
      <quote>
        <paragraph>three</paragraph>
        <paragraph>four</paragraph>
        <paragraph>five</paragraph>
        <paragraph>six</paragraph>
      </quote>
    </document>
  </state>
)
