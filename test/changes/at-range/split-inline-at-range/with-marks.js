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
    .splitInlineAtRange(range)
}

export const input = (
  <state>
    <document>
      <paragraph>
        <link>
          <b>word</b>
        </link>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <link>
          <b>wo</b>
        </link>
        <link>
          <b>rd</b>
        </link>
      </paragraph>
    </document>
  </state>
)
