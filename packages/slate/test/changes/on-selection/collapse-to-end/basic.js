/** @jsx h */

import { h } from 'slate-core-test-helpers'

export default function (change) {
  change.collapseToEnd()
}

export const input = (
  <state>
    <document>
      <paragraph>
        <anchor />one<focus />
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        one<cursor />
      </paragraph>
    </document>
  </state>
)
