/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.removeTextByKey('a', 0, 1)
}

export const input = (
  <value>
    <document>
      <paragraph>
        <text key="a">
          w<anchor />or<focus />d
        </text>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <anchor />or<focus />d
      </paragraph>
    </document>
  </value>
)
