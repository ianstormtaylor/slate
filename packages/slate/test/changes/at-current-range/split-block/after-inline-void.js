/** @jsx h */

import { h } from 'slate-test-helpers'

export default function (change) {
  change.splitBlock()
}

export const input = (
  <state>
    <document>
      <paragraph>
        one<emoji /><cursor />two
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        one<emoji />
      </paragraph>
      <paragraph>
        <cursor />two
      </paragraph>
    </document>
  </state>
)
