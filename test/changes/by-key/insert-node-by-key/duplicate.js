/** @jsx h */

import h from '../../../helpers/h'

import { Block } from '../../../../../..'

export default function (change) {
  const first = document.getBlocks().first()
  change
    .insertNodeByKey(document.key, 0, first)

  const one = next.document.getBlocks().first()
  const two = next.document.getBlocks().last()

  assert.equal(one.type, two.type)
  assert.notEqual(one.key, two.key)
}

export const input = (
  <state>
    <document>
      <x-paragraph>one</x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>one</x-paragraph>
      <x-paragraph>one</x-paragraph>
    </document>
  </state>
)
