/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.delete()
}

export const input = (
  <state>
    <document>
      <quote><anchor />one</quote>
      <paragraph><focus />two</paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph><cursor />two</paragraph>
    </document>
  </state>
)
