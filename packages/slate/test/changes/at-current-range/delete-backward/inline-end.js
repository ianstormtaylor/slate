/** @jsx h */

import { h } from 'slate-test-helpers'

export default function (change) {
  change.deleteBackward()
}

export const input = (
  <state>
    <document>
      <paragraph>
        one<link>two</link><cursor />
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        one<link>tw<cursor /></link>
      </paragraph>
    </document>
  </state>
)
