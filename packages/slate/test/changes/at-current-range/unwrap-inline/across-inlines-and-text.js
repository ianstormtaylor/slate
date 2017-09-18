/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.unwrapInline('link')
}

export const input = (
  <state>
    <document>
      <paragraph>
        <link><anchor />one</link>two<link>three<focus /></link>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <anchor />onetwothree<focus />
      </paragraph>
    </document>
  </state>
)
