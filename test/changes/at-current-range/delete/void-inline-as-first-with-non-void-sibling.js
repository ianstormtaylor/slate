/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const inlineText = texts.get(1)
  const paragraphText = texts.get(2)
  const range = selection.merge({
    anchorKey: inlineText.key,
    anchorOffset: 0,
    focusKey: paragraphText.key,
    focusOffset: 0
  })

  change
    .select(range)
    .delete()

  assert.deepEqual(
    next.selection.toJS(),
    {
      anchorKey: next.document.getTexts().first().key,
      anchorOffset: 0,
      focusKey: next.document.getTexts().first().key,
      focusOffset: 0,
      isBackward: false,
      isFocused: false,
      marks: null
    }
  )
}

export const input = (
  <state>
    <document>
      <paragraph>
        <image></image>abc
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>abc</paragraph>
    </document>
  </state>
)
