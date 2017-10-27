/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.addMarks(['bold', 'underline'])
}

export const input = (
  <state>
    <document>
      <paragraph>
        <anchor /><i>wo<focus />rd</i>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <anchor /><u><b><i>wo</i></b></u><focus /><i>rd</i>
      </paragraph>
    </document>
  </state>
)
