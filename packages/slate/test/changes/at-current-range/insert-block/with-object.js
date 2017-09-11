/** @jsx h */

import { h } from 'slate-core-test-helpers'

export default function (change) {
  change.insertBlock({ type: 'quote' })
}

export const input = (
  <state>
    <document>
      <paragraph>
        <cursor />word
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <quote>
        <cursor />
      </quote>
      <paragraph>
        word
      </paragraph>
    </document>
  </state>
)
