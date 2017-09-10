/** @jsx h */

import h from '../../../helpers/h'

import { Inline } from '../../../../../..'

export default function (change) {
  const first = document.getBlocks().first()

  return state
    .change()
    .insertNodeByKey(first.key, 0, Inline.create({
      type: 'image',
      isVoid: true
    }))
}

export const input = (
  <state>
    <document>
      <paragraph>one</paragraph>
      <paragraph>two</paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <image></image>one
      </paragraph>
      <paragraph>two</paragraph>
    </document>
  </state>
)
