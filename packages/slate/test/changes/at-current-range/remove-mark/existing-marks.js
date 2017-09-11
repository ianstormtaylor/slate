/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.removeMark('bold')
}

export const input = (
  <state>
    <document>
      <paragraph>
        <anchor /><b><i>wo</i><focus /></b><i>rd</i>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <i><anchor />wo<focus />rd</i>
      </paragraph>
    </document>
  </state>
)
