/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.moveNodeByKey('a', 'b', 3)
}

export const input = (
  <state>
    <document>
      <paragraph key="b">
        <link key="a"><cursor />one</link>
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
        <link><cursor />one</link>
      </paragraph>
    </document>
  </state>
)
