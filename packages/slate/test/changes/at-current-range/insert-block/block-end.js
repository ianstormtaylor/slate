/** @jsx h */

import { h } from 'slate-test-helpers'

export default function (change) {
  change.insertBlock('quote')
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
        word
      </paragraph>
      <quote>
        <cursor />
      </quote>
    </document>
  </state>
)
