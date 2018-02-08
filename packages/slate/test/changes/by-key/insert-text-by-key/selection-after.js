/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.insertTextByKey('a', 4, 'x')
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
        w<anchor />or<focus />dx
      </paragraph>
    </document>
  </value>
)
