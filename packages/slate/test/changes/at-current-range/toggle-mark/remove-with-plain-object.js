/** @jsx h */

import { h } from 'slate-test-helpers'

export default function (change) {
  change.toggleMark({
    type: 'bold',
    data: { thing: 'value' }
  })
}

export const input = (
  <state>
    <document>
      <paragraph>
        <anchor /><b thing="value">w</b><focus />ord
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <anchor />w<focus />ord
      </paragraph>
    </document>
  </state>
)
