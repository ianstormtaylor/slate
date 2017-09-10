/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 2,
    focusKey: first.key,
    focusOffset: 2
  })

  return state
    .change()
    .insertInlineAtRange(range, {
      type: 'hashtag',
      isVoid: true
    })
}

export const input = (
  <state>
    <document>
      <paragraph>word</paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>wo
        <hashtag></hashtag>rd
      </paragraph>
    </document>
  </state>
)
