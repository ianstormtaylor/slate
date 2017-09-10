/** @jsx h */

import h from '../../../helpers/h'

import { Block } from '../../../..'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: first.key,
    focusOffset: 0
  })

  return state
    .change()
    .insertBlockAtRange(range, Block.create({ type: 'image' }))
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
      <image></image>
      <paragraph>word</paragraph>
    </document>
  </state>
)
