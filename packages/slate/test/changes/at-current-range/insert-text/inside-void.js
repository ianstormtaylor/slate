/** @jsx h */

import { h } from 'slate-test-helpers'

export default function (change) {
  change.insertText('a')
}

export const input = (
  <state>
    <document>
      <image>
        <cursor />
      </image>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <image>
        <cursor />
      </image>
    </document>
  </state>
)
