/** @jsx h */

import h from '../../../helpers/h'

import { Block } from '../../../../../..'

export default function (change) {
  const { selection } = state

  let next = state
    .change()
    .insertNodeByKey('key1', 0, Block.create({ type: 'default' }))

    .change()
    .undo()
    .state

  assert.deepEqual(next.selection.toJS(), selection.toJS())
}

export const input = (
  <state>
    <document>
      <paragraph>The</paragraph>
      <paragraph>text</paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>The</paragraph>
      <paragraph>text</paragraph>
    </document>
  </state>
)
