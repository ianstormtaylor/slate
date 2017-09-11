/** @jsx h */

import { h } from 'slate-test-helpers'

export default function (change) {
  change.deleteBackward(3)
}

export const input = (
  <state>
    <document>
      <paragraph>word<cursor /></paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>w<cursor /></paragraph>
    </document>
  </state>
)
