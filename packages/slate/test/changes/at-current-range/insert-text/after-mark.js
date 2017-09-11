/** @jsx h */

import { h } from 'slate-core-test-helpers'

export default function (change) {
  change.insertText('a')
}

export const input = (
  <state>
    <document>
      <paragraph>
        w<b>or</b><cursor />d
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        w<b>ora</b>d
      </paragraph>
    </document>
  </state>
)
