/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.splitInline()
}

export const input = (
  <value>
    <document>
      <paragraph>
        <link>
          w<anchor />or<focus />d
        </link>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <link>w</link>
        <link>
          <cursor />d
        </link>
      </paragraph>
    </document>
  </value>
)
