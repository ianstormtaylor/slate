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
    .setInlineAtRange(range, 'code')
}

export const input = (
  <state>
    <document>
      <paragraph>
        <link>word</link>
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
    </document>
  </state>
)
