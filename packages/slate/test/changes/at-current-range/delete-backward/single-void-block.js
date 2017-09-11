/** @jsx h */

import { h } from 'slate-core-test-helpers'

export default function (change) {
  change.deleteBackward()
}

export const input = (
  <state>
    <document>
      <image>
        <cursor />{' '}
      </image>
    </document>
  </state>
)

export const output = (
  <state>
    <document />
  </state>
)
