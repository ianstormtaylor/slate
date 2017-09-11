/** @jsx h */

import { h } from 'slate-core-test-helpers'

export default function (change) {
  change.delete()
}

export const input = (
  <state>
    <document>
      <paragraph>
        <anchor />one
      </paragraph>
      <paragraph>
        two
      </paragraph>
      <quote>
        <focus />three
      </quote>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <quote>
        <cursor />three
      </quote>
    </document>
  </state>
)
