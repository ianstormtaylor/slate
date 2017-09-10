/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.wrapInline('hashtag')
}

export const input = (
  <state>
    <document>
      <paragraph>
        <link>wo<anchor />rd</link><link>an<focus />other</link>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <link>wo</link><hashtag><link><anchor />rd</link><link>an</link></hashtag><focus /><link>other</link>
      </paragraph>
    </document>
  </state>
)
