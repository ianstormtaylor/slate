/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const second = texts.last()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 2,
    focusKey: second.key,
    focusOffset: 2
  })

  return state
    .change()
    .unwrapInlineAtRange(range, 'hashtag')
}

export const input = (
  <state>
    <document>
      <paragraph>wo
        <hashtag>rd</hashtag>
      </paragraph>
      <paragraph>
        <hashtag>an</hashtag>other
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>word</paragraph>
      <paragraph>another</paragraph>
    </document>
  </state>
)
