/** @jsx h */

import { h } from 'slate-test-helpers'

export default function (change) {
  change.deleteCharForward()
}

export const input = (
  <state>
    <document>
      <paragraph>
        <cursor />📛<link>word</link>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <cursor /><link>word</link>
      </paragraph>
    </document>
  </state>
)
