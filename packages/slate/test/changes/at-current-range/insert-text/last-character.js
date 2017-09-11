/** @jsx h */

import { h } from 'slate-test-helpers'

export default function (change) {
  change.insertText('a')
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
        worda<cursor />
      </paragraph>
    </document>
  </state>
)
