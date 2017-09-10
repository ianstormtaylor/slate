/** @jsx h */

import h from '../../../helpers/h'

import { Mark } from '../../../..'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: first.key,
    focusOffset: 1
  })

  return state
    .change()
    .toggleMarkAtRange(range, Mark.create({
      type: 'bold',
      data: { thing: 'value' }
    }))
}

export const input = (
  <state>
    <document>
      <paragraph>
        <b>w</b>ord
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>word</paragraph>
    </document>
  </state>
)
