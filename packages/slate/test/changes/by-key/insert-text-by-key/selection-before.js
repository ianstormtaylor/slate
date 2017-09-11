/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.insertTextByKey('a', 0, 'x')
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
        xw<anchor />or<focus />d
      </paragraph>
    </document>
  </state>
)
