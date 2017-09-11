/** @jsx h */

import { h } from 'slate-core-test-helpers'

export default function (change) {
  change
    .toggleMark('bold')
    .insertText('s')
}

export const input = (
  <state>
    <document>
      <paragraph>
        word<cursor />
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        word<b>s</b><cursor />
      </paragraph>
    </document>
  </state>
)
