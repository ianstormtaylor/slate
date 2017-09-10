/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const second = texts.get(1)
  const fourth = texts.get(3)
  const range = selection.merge({
    anchorKey: second.key,
    anchorOffset: 0,
    focusKey: fourth.key,
    focusOffset: 0
  })

  change
    .select(range)
    .delete()

  const updated = next.document.getTexts().first()

  assert.deepEqual(next.selection.toJS(), {
    anchorKey: updated.key,
    anchorOffset: first.text.length,
    focusKey: updated.key,
    focusOffset: first.text.length,
    isBackward: false,
    isFocused: false,
    marks: null
  })
}

export const input = (
  <state>
    <document>
      <paragraph>one
        <image></image>two
      </paragraph>
      <paragraph>three</paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>onethree</paragraph>
    </document>
  </state>
)
