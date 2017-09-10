/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 1,
    focusKey: first.key,
    focusOffset: 3
  })

  change
    .select(range)
    .wrapInline('hashtag')

  const nexts = next.document.getTexts()
  const two = nexts.get(1)
  const three = nexts.get(2)

  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
      anchorKey: two.key,
      anchorOffset: 0,
      focusKey: three.key,
      focusOffset: 0,
    }).toJS()
  )
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
      <paragraph>w
        <hashtag>or</hashtag>d
      </paragraph>
    </document>
  </state>
)
