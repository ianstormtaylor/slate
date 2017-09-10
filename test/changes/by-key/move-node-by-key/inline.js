/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.moveNodeByKey('a', 'b', 3)
}

export const input = (
  <state>
    <document>
      <paragraph key="b">
        <link key="a">one</link>
        <link>two</link>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <link>two</link>
        <link>one</link>
      </paragraph>
    </document>
  </state>
)
