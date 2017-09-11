/** @jsx h */

import { h } from 'slate-core-test-helpers'

export default function (change) {
  change.moveNodeByKey('a', 'b', 1)
}

export const input = (
  <state>
    <document key="b">
      <paragraph key="a">
        one
      </paragraph>
      <paragraph>
        two
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>two</paragraph>
      <paragraph>one</paragraph>
    </document>
  </state>
)
