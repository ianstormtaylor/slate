/** @jsx h */

import { h } from 'slate-test-helpers'

export default function (change) {
  change.splitInline(1)
}

export const input = (
  <state>
    <document>
      <paragraph>
        <link><link>wo<cursor />rd</link></link>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <link><link>wo</link><cursor /><link>rd</link></link>
      </paragraph>
    </document>
  </state>
)
