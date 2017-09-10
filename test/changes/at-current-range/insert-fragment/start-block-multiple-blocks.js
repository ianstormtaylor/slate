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
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: first.key,
    focusOffset: 0
  })

  change
    .select(range)
    .insertFragment(fragment)

  const last = next.document.getTexts().last()

  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
      anchorKey: last.key,
      anchorOffset: fragment.getTexts().last().text.length,
      focusKey: last.key,
      focusOffset: fragment.getTexts().last().text.length
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
      <paragraph>fragment</paragraph>
      <list-item>second fragment</list-item>
      <list-item>third fragmentword</list-item>
    </document>
  </state>
)
