/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.insertTextByKey('a', 1, 'x')
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
        wx<anchor />or<focus />d
      </paragraph>
    </document>
  </value>
)
