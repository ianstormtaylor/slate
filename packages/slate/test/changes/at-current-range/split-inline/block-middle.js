/** @jsx h */

import { h } from 'slate-core-test-helpers'

export default function (change) {
  change.splitInline()
}

export const input = (
  <state>
    <document>
      <paragraph>
        <link>wo<cursor />rd</link>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <link>wo</link><cursor /><link>rd</link>
      </paragraph>
    </document>
  </state>
)
