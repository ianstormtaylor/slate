/** @jsx h */

import { h } from 'slate-core-test-helpers'

export default function (change) {
  change.deleteForward()
}

export const input = (
  <state>
    <document>
      <paragraph>
        w<cursor />ord
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        wrd
      </paragraph>
    </document>
  </state>
)
