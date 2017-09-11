/** @jsx h */

import h from '../../../helpers/h'
import { Mark } from '../../../..'

export default function (change) {
  change.toggleMark(Mark.create({
    type: 'bold',
    data: { thing: 'value' }
  }))
}

export const input = (
  <state>
    <document>
      <paragraph>
        <anchor />w<focus />ord
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <anchor /><b thing="value">w</b><focus />ord
      </paragraph>
    </document>
  </state>
)
