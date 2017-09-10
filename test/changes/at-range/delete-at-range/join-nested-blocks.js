/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.get(0)
  const second = texts.get(1)
  const third = texts.get(2)
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: first.text.length,
    focusKey: second.key,
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
        <item>three</item>
      </list>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <list>
        <item>onetwo</item>
        <item>three</item>
      </list>
    </document>
  </state>
)
