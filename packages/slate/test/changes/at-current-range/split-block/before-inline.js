/** @jsx h */

import { h } from 'slate-test-helpers'

export default function (change) {
  change.splitBlock()
}

export const input = (
  <state>
    <document>
      <paragraph>
        word<link href="website.com"><cursor />hyperlink</link>word
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        word
      </paragraph>
      <paragraph>
        <cursor /><link href="website.com">hyperlink</link>word
      </paragraph>
    </document>
  </state>
)
