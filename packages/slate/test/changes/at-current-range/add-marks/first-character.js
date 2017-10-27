/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.addMarks(['bold', 'italic'])
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
        <anchor /><i><b>w</b></i><focus />ord
      </paragraph>
    </document>
  </state>
)
