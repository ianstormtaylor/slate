/** @jsx h */

import { h } from 'slate-test-helpers'

export default function (change) {
  change.wrapText('[[', ']]')
}

export const input = (
  <state>
    <document>
      <paragraph>
        <link>wo<anchor />rd</link>
        <link>an<focus />other</link>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <link>wo[[<anchor />rd</link>
        <link>an<focus />]]other</link>
      </paragraph>
    </document>
  </state>
)
