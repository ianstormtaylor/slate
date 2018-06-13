/** @jsx h */

import h from '../../../helpers/h'
import { Inline } from '../../../../src'

export default function(change) {
  change.insertNodeByKey(
    'a',
    0,
    Inline.create({
      type: 'emoji',
      isVoid: true,
    })
  )
}

export const input = (
  <value>
    <document>
      <paragraph key="a">
        <cursor />one
      </paragraph>
      <paragraph>two</paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <emoji />
        <cursor />one
      </paragraph>
      <paragraph>two</paragraph>
    </document>
  </value>
)
