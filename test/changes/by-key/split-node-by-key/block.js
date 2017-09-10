/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change
    .splitNodeByKey('a', 0)
}

export const input = (
  <state>
    <document>
      <paragraph>word</paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph></paragraph>
      <paragraph>word</paragraph>
    </document>
  </state>
)
