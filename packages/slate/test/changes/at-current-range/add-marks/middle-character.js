/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.addMarks(['bold', 'italic'])
}

export const input = (
  <state>
    <document>
      <paragraph>
        w<anchor />o<focus />rd
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        w<anchor /><i><b>o</b></i><focus />rd
      </paragraph>
    </document>
  </state>
)
