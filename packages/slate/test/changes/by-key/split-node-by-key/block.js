/** @jsx h */

import { h } from 'slate-core-test-helpers'

export default function (change) {
  change.splitNodeByKey('a', 2)
}

export const input = (
  <state>
    <document>
      <paragraph key="a">
        <link>one</link><link>two</link>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <link>one</link>
      </paragraph>
      <paragraph>
        <link>two</link>
      </paragraph>
    </document>
  </state>
)
