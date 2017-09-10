/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const second = texts.get(1)
  const fifth = texts.get(4)
  const range = selection.merge({
    anchorKey: second.key,
    anchorOffset: 2,
    focusKey: fifth.key,
    focusOffset: 2
  })

  return state
    .change()
    .setInlineAtRange(range, { type: 'code' })
}

export const input = (
  <state>
    <document>
      <paragraph>
        <link>word</link>
      </paragraph>
      <paragraph>
        <link>another</link>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <code>word</code>
      </paragraph>
      <paragraph>
        <code>another</code>
      </paragraph>
    </document>
  </state>
)
