/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.removeTextByKey('a', 3, 1)
}

export const input = (
  <state>
    <document>
      <paragraph>
        <text key="a">w<anchor />or<focus />d</text>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        w<anchor />or<focus />
      </paragraph>
    </document>
  </state>
)
