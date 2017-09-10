/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const last = texts.last()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 1,
    focusKey: last.key,
    focusOffset: 0
  })

  return state
    .change()
    .unwrapInlineAtRange(range, {
      type: 'hashtag',
      data: { key: 'one' }
    })
}

export const input = (
  <state>
    <document>
      <paragraph>w
        <hashtag>
          <hashtag>or</hashtag>
        </hashtag>d
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>w
        <hashtag>or</hashtag>d
      </paragraph>
    </document>
  </state>
)
