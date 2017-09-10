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

  return state
    .change()
    .deleteBackwardAtRange(range)
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
