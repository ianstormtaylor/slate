/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.removeTextByKey('a', 2, 1)
}

export const input = (
  <value>
    <document>
      <paragraph>
        <text key="a">
          <anchor />word<focus />
        </text>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <anchor />wod<focus />
      </paragraph>
    </document>
  </value>
)
