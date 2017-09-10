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

  change
    .select(range)
    .wrapInline('hashtag')

  const two = next.document.getTexts().get(1)
  const six = next.document.getTexts().get(5)

  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
      anchorKey: two.key,
      anchorOffset: 0,
      focusKey: six.key,
      focusOffset: 0
    }).toJS()
  )
}

export const input = (
  <state>
    <document>
      <paragraph>word</paragraph>
      <paragraph>another</paragraph>
    </document>
  </state>
)

export const output = (
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
