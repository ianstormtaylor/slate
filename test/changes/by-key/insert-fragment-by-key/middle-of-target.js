/** @jsx h */

import h from '../../../helpers/h'

import path from 'path'
import readMetadata from 'read-metadata'
import { Raw } from '../../../../../..'

export default function (change) {
  const file = path.resolve(__dirname, 'fragment.yaml')
  const raw = readMetadata.sync(file)
  const fragment = Raw.deserialize(raw, { terse: true }).document


  return state
    .change()
    .insertFragmentByKey(document.key, 2, fragment)
}

export const input = (
  <state>
    <document>
      <paragraph>word</paragraph>
      <paragraph>word2</paragraph>
      <paragraph>word3</paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>word</paragraph>
      <paragraph>word2</paragraph>
      <paragraph>fragment</paragraph>
      <paragraph>fragment2</paragraph>
      <paragraph>word3</paragraph>
    </document>
  </state>
)
