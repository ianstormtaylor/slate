/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.splitDescendantsByKey('a', 'b', 2)
}

export const input = (
  <state>
    <document>
      <paragraph key="a">
        <text key="b">w<anchor />or<focus />d</text>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        w<anchor />o
      </paragraph>
      <paragraph>
        r<focus />d
      </paragraph>
    </document>
  </state>
)
