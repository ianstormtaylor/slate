/** @jsx h */

import { h } from 'slate-core-test-helpers'

export default function (change) {
  change.insertText('a')
}

export const input = (
  <state>
    <document>
      <paragraph>
        w<cursor />ord
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        wa<cursor />ord
      </paragraph>
    </document>
  </state>
)
