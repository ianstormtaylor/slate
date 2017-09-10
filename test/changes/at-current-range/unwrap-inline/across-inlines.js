/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.unwrapInline('hashtag')
}

export const input = (
  <state>
    <document>
      <paragraph>
        <link>wo<anchor /></link><hashtag><link>rd</link></hashtag><hashtag><link>an</link></hashtag><link>ot<focus />her</link>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <link>wo<anchor /></link><link>rd</link><link>an</link><link>ot<focus />her</link>
      </paragraph>
    </document>
  </state>
)
