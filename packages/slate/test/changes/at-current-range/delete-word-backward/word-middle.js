/** @jsx h */

import { h } from 'slate-test-helpers'

export default function (change) {
  change.deleteWordBackward()
}

export const input = (
  <state>
    <document>
      <paragraph>
        one two thr<cursor />ee
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        one two <cursor />ee
      </paragraph>
    </document>
  </state>
)
