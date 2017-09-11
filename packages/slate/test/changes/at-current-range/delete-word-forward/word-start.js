/** @jsx h */

import { h } from 'slate-core-test-helpers'

export default function (change) {
  change.deleteWordForward()
}

export const input = (
  <state>
    <document>
      <paragraph>
        <cursor />one two three
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <cursor /> two three
      </paragraph>
    </document>
  </state>
)
