/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.splitNodeByKey('a', 2)
}

export const input = (
  <state>
    <document>
      <paragraph key="a">
        <link>o<anchor />ne</link><link>tw<focus />o</link>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <link>o<anchor />ne</link>
      </paragraph>
      <paragraph>
        <link>tw<focus />o</link>
      </paragraph>
    </document>
  </state>
)
