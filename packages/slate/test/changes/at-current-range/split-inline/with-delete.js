/** @jsx h */

import { h } from 'slate-core-test-helpers'

export default function (change) {
  change.splitInline()
}

export const input = (
  <state>
    <document>
      <paragraph>
        <link>w<anchor />or<focus />d</link>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <link>w</link><cursor /><link>d</link>
      </paragraph>
    </document>
  </state>
)
