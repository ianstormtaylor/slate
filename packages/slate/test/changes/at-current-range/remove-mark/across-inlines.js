/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.removeMark('bold')
}

export const input = (
  <state>
    <document>
      <paragraph>
        <link>wo<anchor /><b>rd</b></link>
      </paragraph>
      <paragraph>
        <link><b>an</b><focus />other</link>
      </paragraph>
    </document>
  </state>
)

export const output = (
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
