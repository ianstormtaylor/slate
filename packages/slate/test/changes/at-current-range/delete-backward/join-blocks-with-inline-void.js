/** @jsx h */

import { h } from 'slate-core-test-helpers'

export default function (change) {
  change.deleteBackward()
}

export const input = (
  <state>
    <document>
      <paragraph>
        <emoji />
      </paragraph>
      <paragraph>
        <cursor />word
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <emoji /><cursor />word
      </paragraph>
    </document>
  </state>
)
