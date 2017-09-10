/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 3,
    focusKey: first.key,
    focusOffset: 3
  })

  return state
    .change()
    .insertTextAtRange(range, 'a')
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
        <b>ora</b>d
      </paragraph>
    </document>
  </state>
)
