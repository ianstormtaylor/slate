/** @jsx h */

import { h } from 'slate-test-helpers'

export default function (change) {
  change.removeNodeByKey('a')
}

export const input = (
  <state>
    <document>
      <paragraph>
        <link key="a">one</link>
      </paragraph>
      <paragraph>
        two
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph />
      <paragraph>
        two
      </paragraph>
    </document>
  </state>
)
