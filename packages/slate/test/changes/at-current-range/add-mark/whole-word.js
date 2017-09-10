/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.addMark('bold')
}

export const input = (
  <state>
    <document>
      <paragraph>
        <anchor />word<focus />
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <anchor /><b>word</b><focus />
      </paragraph>
    </document>
  </state>
)
