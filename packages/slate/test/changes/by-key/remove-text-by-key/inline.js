/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.removeTextByKey('a', 3, 1)
}

export const input = (
  <value>
    <document>
      <paragraph>
        <link><text key="a">word</text></link>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <link>wor</link>
      </paragraph>
    </document>
  </value>
)
