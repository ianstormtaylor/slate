/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: first.key,
    focusOffset: 0
  })

  change
    .select(range)
    .insertInline({
      type: 'hashtag',
      isVoid: true
    })

  const updated = next.document.getTexts().get(1)

  assert.deepEqual(
    next.selection.toJS(),
    range.collapseToEndOf(updated).toJS()
  )
}

export const input = (
  <state>
    <document>
      <paragraph></paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <hashtag></hashtag>
      </paragraph>
    </document>
  </state>
)
