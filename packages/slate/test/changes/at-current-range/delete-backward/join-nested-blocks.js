/** @jsx h */

import { h } from 'slate-core-test-helpers'

export default function (change) {
  change.deleteBackward()
}

export const input = (
  <state>
    <document>
      <quote>
        <paragraph>
          word
        </paragraph>
        <paragraph>
          <cursor />another
        </paragraph>
      </quote>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <quote>
        <paragraph>
          word<cursor />another
        </paragraph>
      </quote>
    </document>
  </state>
)
