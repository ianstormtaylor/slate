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

  change
    .select(range)
    .insertText('a')

  assert.deepEqual(
    next.selection.toJS(),
    range.move(1).toJS()
  )
}

export const input = (
  <state>
    <document>
      <paragraph>w
        <b>or</b>d
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>w
        <b>oar</b>d
      </paragraph>
    </document>
  </state>
)
