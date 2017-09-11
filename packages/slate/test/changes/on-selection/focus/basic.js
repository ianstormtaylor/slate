/** @jsx h */

import { h } from 'slate-core-test-helpers'

export default function (change) {
  change.focus()
}

export const input = (
  <state>
    <document>
      <paragraph>one</paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph><cursor />one</paragraph>
    </document>
  </state>
)
