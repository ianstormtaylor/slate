/** @jsx h */

import { h } from 'slate-core-test-helpers'

export default function (change) {
  change.removeMark('bold')
}

export const input = (
  <state>
    <document>
      <paragraph>
        wo<anchor /><b>rd</b>
      </paragraph>
      <paragraph>
        <b>an</b><focus />other
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        wo<anchor />rd
      </paragraph>
      <paragraph>
        an<focus />other
      </paragraph>
    </document>
  </state>
)
