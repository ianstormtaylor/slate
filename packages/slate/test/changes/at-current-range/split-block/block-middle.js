/** @jsx h */

import { h } from 'slate-core-test-helpers'

export default function (change) {
  change.splitBlock()
}

export const input = (
  <state>
    <document>
      <paragraph>
        wo<cursor />rd
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        wo
      </paragraph>
      <paragraph>
        <cursor />rd
      </paragraph>
    </document>
  </state>
)
