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
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 2,
    focusKey: first.key,
    focusOffset: 2
  })

  return state
    .change()
    .insertFragmentAtRange(range, fragment)
}

export const input = (
  <state>
    <document>
      <list-item>
        <paragraph>first</paragraph>
        <paragraph>second</paragraph>
      </list-item>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <list-item>
        <paragraph>fifragment one</paragraph>
        <paragraph>fragment tworst</paragraph>
        <paragraph>second</paragraph>
      </list-item>
    </document>
  </state>
)
