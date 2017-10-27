/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.delete()
}

export const input = (
  <value>
    <document>
      <quote><anchor />one</quote>
      <paragraph><focus />two</paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph><cursor />two</paragraph>
    </document>
  </value>
)
