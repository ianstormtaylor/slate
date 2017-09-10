/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const second = texts.get(1)
  const thirteenth = texts.get(12)
  const range = selection.merge({
    anchorKey: second.key,
    anchorOffset: 2,
    focusKey: thirteenth.key,
    focusOffset: 2
  })

  return state
    .change()
    .unwrapInlineAtRange(range, 'hashtag')
}

export const input = (
  <state>
    <document>
      <paragraph>
        <link>wo</link>
        <hashtag>
          <link>rd</link>
        </hashtag>
        <hashtag>
          <link>an</link>
        </hashtag>
        <link>other</link>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <link>wo</link>
        <link>rd</link>
        <link>an</link>
        <link>other</link>
      </paragraph>
    </document>
  </state>
)
