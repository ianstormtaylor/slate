/** @jsx h */

import { h } from 'slate-test-helpers'

export default function (change) {
  change.deleteWordForward()
}

export const input = (
  <state>
    <document>
      <paragraph>
        o<cursor />ne two three
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        o<cursor /> two three
      </paragraph>
    </document>
  </state>
)
