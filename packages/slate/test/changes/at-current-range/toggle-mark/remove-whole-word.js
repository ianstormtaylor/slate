/** @jsx h */

import { h } from 'slate-core-test-helpers'

export default function (change) {
  change.toggleMark('bold')
}

export const input = (
  <state>
    <document>
      <paragraph>
        <anchor /><b>word</b><focus />
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <anchor />word<focus />
      </paragraph>
    </document>
  </state>
)
