/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const third = texts.get(2)
  const range = selection.merge({
    anchorKey: third.key,
    anchorOffset: 0,
    focusKey: third.key,
    focusOffset: 2
  })

  change
    .select(range)
    .unwrapInline({
      type: 'hashtag',
      data: { key: 'one' }
    })

  assert.deepEqual(
    next.selection.toJS(),
    range.toJS()
  )
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
