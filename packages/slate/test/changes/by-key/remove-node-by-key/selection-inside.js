/** @jsx h */

import { h } from 'slate-test-helpers'

export default function (change) {
  change.removeNodeByKey('a')
}

export const input = (
  <state>
    <document>
      <paragraph>
        one
      </paragraph>
      <paragraph>
        <text key="a">t<cursor />wo</text>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        one<cursor />
      </paragraph>
      <paragraph />
    </document>
  </state>
)
