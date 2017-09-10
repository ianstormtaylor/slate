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
  const second = texts.get(1)
  const last = fragment.getTexts().last()
  const range = selection.merge({
    anchorKey: second.key,
    anchorOffset: 0,
    focusKey: second.key,
    focusOffset: 0
  })

  change
    .select(range)
    .insertFragment(fragment)

  const updated = next.document.getTexts().get(1)

  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
      anchorKey: updated.key,
      anchorOffset: last.text.length,
      focusKey: updated.key,
      focusOffset: last.text.length
    }).toJS()
  )
}

export const input = (
  <state>
    <document>
      <paragraph>
        <link>word</link>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>fragment
        <link>word</link>
      </paragraph>
    </document>
  </state>
)
