/** @jsx h */

import h from '../../../helpers/h'

import path from 'path'
import readMetadata from 'read-metadata'
import { Raw } from '../../../../../..'

export default function (change) {
  const file = path.resolve(__dirname, 'fragment.yaml')
  const raw = readMetadata.sync(file)
  const fragment = Raw.deserialize(raw, { terse: true }).document

  const texts = document.getTexts()
  const first = texts.first()
  const last = fragment.getTexts().last()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 2,
    focusKey: first.key,
    focusOffset: 2
  })

  change
    .select(range)
    .insertFragment(fragment)

  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
      anchorKey: first.key,
      anchorOffset: range.anchorOffset + last.text.length,
      focusKey: first.key,
      focusOffset: range.focusOffset + last.text.length
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
      <paragraph>wofragmentrd</paragraph>
    </document>
  </state>
)
