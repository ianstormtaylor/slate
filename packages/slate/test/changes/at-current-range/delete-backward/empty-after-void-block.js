/** @jsx h */

import { h } from 'slate-core-test-helpers'

export default function (change) {
  change.deleteBackward()
}

export const input = (
  <state>
    <document>
      <image />
      <paragraph>
        <cursor />
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <image>
        <cursor />{' '}
      </image>
    </document>
  </state>
)
