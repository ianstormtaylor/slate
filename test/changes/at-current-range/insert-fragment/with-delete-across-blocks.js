/** @jsx h */

import h from '../../../helpers/h'

import path from 'path'
import readMetadata from 'read-metadata'
import { Raw } from '../../../..'

export default function (change) {
  const file = path.resolve(__dirname, 'fragment.yaml')
  const raw = readMetadata.sync(file)
  const fragment = Raw.deserialize(raw, { terse: true }).document

  const texts = document.getTexts()
  const first = texts.first()
  const last = texts.last()
  const fragLast = fragment.getTexts().last()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 2,
    focusKey: last.key,
    focusOffset: 2
  })

  change
    .select(range)
    .insertFragment(fragment)

  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
      anchorKey: first.key,
      anchorOffset: range.anchorOffset + fragLast.text.length,
      focusKey: first.key,
      focusOffset: range.focusOffset + fragLast.text.length
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
      <paragraph>wofragmentother</paragraph>
    </document>
  </state>
)
