/** @jsx h */

import { h } from 'slate-core-test-helpers'

export default function (change) {
  change.unwrapBlock('quote')
}

export const input = (
  <state>
    <document>
      <quote>
        <paragraph>
          <cursor />word
        </paragraph>
      </quote>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <cursor />word
      </paragraph>
    </document>
  </state>
)
