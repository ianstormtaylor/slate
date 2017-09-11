/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.removeMark({
    type: 'bold',
    data: { thing: 'value' }
  })
}

export const input = (
  <state>
    <document>
      <paragraph>
        <b thing="value"><anchor />w<focus /></b>ord
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <anchor />w<focus />ord
      </paragraph>
    </document>
  </state>
)
