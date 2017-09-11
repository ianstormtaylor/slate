/** @jsx h */

import { h } from 'slate-test-helpers'

export default function (change) {
  change.splitInline()
}

export const input = (
  <state>
    <document>
      <paragraph>
        <link><b>wo<cursor />rd</b></link>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <link><b>wo</b></link><cursor /><link><b>rd</b></link>
      </paragraph>
    </document>
  </state>
)
