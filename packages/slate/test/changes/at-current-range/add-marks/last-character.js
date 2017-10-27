/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.addMarks(['bold', 'italic'])
}

export const input = (
  <state>
    <document>
      <paragraph>
        wor<anchor />d<focus />
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        wor<anchor /><i><b>d</b></i><focus />
      </paragraph>
    </document>
  </state>
)
