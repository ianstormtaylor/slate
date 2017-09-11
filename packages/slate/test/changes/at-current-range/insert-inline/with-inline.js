/** @jsx h */

import h from '../../../helpers/h'
import { Inline } from '../../../..'

export default function (change) {
  change.insertInline(Inline.create({
    type: 'emoji',
    isVoid: true
  }))
}

export const input = (
  <state>
    <document>
      <paragraph>wo<cursor />rd</paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        wo<emoji><cursor />{' '}</emoji>rd
      </paragraph>
    </document>
  </state>
)
