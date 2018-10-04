/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.removeTextByKey('a', 3, 1)
}

export const input = (
  <value>
    <document>
      <paragraph>
        <text />
        <link>
          <text key="a">word</text>
        </link>
        <text />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <text />
        <link>wor</link>
        <text />
      </paragraph>
    </document>
  </value>
)
