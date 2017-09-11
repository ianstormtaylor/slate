/** @jsx h */

import { h } from 'slate-test-helpers'

export default function (change) {
  change.splitBlock()
}

export const input = (
  <state>
    <document>
      <paragraph>
        word<cursor />
      </paragraph>
      <paragraph>
        another
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
        <cursor />
      </paragraph>
      <paragraph>
        another
      </paragraph>
    </document>
  </state>
)
