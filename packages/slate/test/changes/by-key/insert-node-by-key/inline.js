/** @jsx h */

import h from '../../../helpers/h'
import { Inline } from '../../../..'

export default function (change) {
  change.insertNodeByKey('a', 0, Inline.create({
    type: 'emoji',
    isVoid: true
  }))
}

export const input = (
  <state>
    <document>
      <paragraph key="a">
        one
      </paragraph>
      <paragraph>
        two
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <emoji />one
      </paragraph>
      <paragraph>
        two
      </paragraph>
    </document>
  </state>
)
