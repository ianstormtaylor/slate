/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.splitBlock()
}

export const input = (
  <state>
    <document>
      <paragraph>w<anchor />or<focus />d</paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>w</paragraph>
      <paragraph><cursor />d</paragraph>
    </document>
  </state>
)
