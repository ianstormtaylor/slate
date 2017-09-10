/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const second = texts.get(1)
  const range = selection.merge({
    anchorKey: second.key,
    anchorOffset: 2,
    focusKey: second.key,
    focusOffset: 2
  })

  return state
    .change()
    .deleteCharForwardAtRange(range)
}

export const input = (
  <state>
    <document>
      <paragraph>one
        <link>tw📛o</link>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>one
        <link>two</link>
      </paragraph>
    </document>
  </state>
)
