/** @jsx h */

import { h } from 'slate-core-test-helpers'

export default function (change) {
  change.toggleMark('bold')
}

export const input = (
  <state>
    <document>
      <paragraph>
        <i><anchor />wo<focus />rd</i>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <anchor /><b><i>wo</i></b><focus /><i>rd</i>
      </paragraph>
    </document>
  </state>
)
