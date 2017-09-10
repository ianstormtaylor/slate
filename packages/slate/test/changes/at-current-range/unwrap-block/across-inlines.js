/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.unwrapBlock('quote')
}

export const input = (
  <state>
    <document>
      <quote>
        <paragraph>
          <link>wo<anchor />rd</link>
        </paragraph>
        <paragraph>
          <link>an<focus />other</link>
        </paragraph>
      </quote>
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
