/** @jsx h */

import { h } from 'slate-core-test-helpers'

export default function (change) {
  change.addMark('bold')
}

export const input = (
  <state>
    <document>
      <paragraph>
        <anchor />w<focus />ord
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <anchor /><b>w</b><focus />ord
      </paragraph>
    </document>
  </state>
)
