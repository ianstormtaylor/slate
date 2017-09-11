/** @jsx h */

import { h } from 'slate-test-helpers'

export default function (change) {
  change.deleteWordBackward()
}

export const input = (
  <state>
    <document>
      <paragraph>
        one two three<cursor />
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        one two <cursor />
      </paragraph>
    </document>
  </state>
)
