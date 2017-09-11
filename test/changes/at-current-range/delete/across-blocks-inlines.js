/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.delete()
}

export const input = (
  <state>
    <document>
      <paragraph>
        <link>wo<anchor />rd</link>
      </paragraph>
      <paragraph>
        <link>an<focus />other</link>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <link>wo<cursor /></link>
        <link>other</link>
      </paragraph>
    </document>
  </state>
)
