/** @jsx h */

import { h } from 'slate-core-test-helpers'

export default function (change) {
  change.blur()
}

export const input = (
  <state>
    <document>
      <paragraph>
        <cursor />one
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        one
      </paragraph>
    </document>
  </state>
)
