/** @jsx h */

import { h } from 'slate-test-helpers'

export default function (change) {
  change.deleteBackward()
}

export const input = (
  <state>
    <document>
      <paragraph>
        a<cursor /><link>two</link>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <cursor /><link>two</link>
      </paragraph>
    </document>
  </state>
)
