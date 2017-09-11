/** @jsx h */

import { h } from 'slate-core-test-helpers'

export default function (change) {
  change.insertTextByKey('a', 2, 'x')
}

export const input = (
  <state>
    <document>
      <paragraph>
        <text key="a">w<anchor />or<focus />d</text>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        w<anchor />oxr<focus />d
      </paragraph>
    </document>
  </state>
)
