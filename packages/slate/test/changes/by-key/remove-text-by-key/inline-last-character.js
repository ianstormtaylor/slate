/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.removeTextByKey('a', 0, 1)
}

export const input = (
  <value>
    <document>
      <paragraph>
        <link>
          <text key="a">a</text>
        </link>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <link />
      </paragraph>
    </document>
  </value>
)
