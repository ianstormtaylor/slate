/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const second = texts.get(1)
  const third = texts.get(2)
  const range = selection.merge({
    anchorKey: second.key,
    anchorOffset: second.text.length,
    focusKey: third.key,
    focusOffset: 0
  })

  return state
    .change()
    .deleteAtRange(range)
}

export const input = (
  <state>
    <document>
      <list>
        <item>one</item>
        <item>two</item>
      </list>
      <paragraph>three</paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <list>
        <item>one</item>
        <item>twothree</item>
      </list>
    </document>
  </state>
)
