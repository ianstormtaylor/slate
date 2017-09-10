/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const second = texts.get(1)
  const range = selection.merge({
    anchorKey: second.key,
    anchorOffset: second.text.length,
    focusKey: second.key,
    focusOffset: second.text.length
  })

  return state
    .change()
    .deleteBackwardAtRange(range)
}

export const input = (
  <state>
    <document>
      <paragraph>one
        <link>a</link>two
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>onetwo</paragraph>
    </document>
  </state>
)
