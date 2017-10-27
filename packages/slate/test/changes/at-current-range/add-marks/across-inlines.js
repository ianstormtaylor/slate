/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.addMarks(['bold', 'italic'])
}

export const input = (
  <state>
    <document>
      <paragraph>
        <link>wo<anchor />rd</link>
      </paragraph>
      <paragraph>
        <link>an<focus />other</link>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <link>
          wo<anchor /><i><b>rd</b></i>
        </link>
      </paragraph>
      <paragraph>
        <link>
        <i><b>an</b></i><focus />other
        </link>
      </paragraph>
    </document>
  </state>
)
