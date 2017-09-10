/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const third = texts.get(2)
  const fourth = texts.get(3)
  const range = selection.merge({
    anchorKey: third.key,
    anchorOffset: 0,
    focusKey: fourth.key,
    focusOffset: 0
  })

  return state
    .change()
    .unwrapBlockAtRange(range, 'quote')
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
      <quote>
        <paragraph>one</paragraph>
        <paragraph>two</paragraph>
      </quote>
      <paragraph>three</paragraph>
      <paragraph>four</paragraph>
      <quote>
        <paragraph>five</paragraph>
        <paragraph>six</paragraph>
      </quote>
    </document>
  </state>
)
