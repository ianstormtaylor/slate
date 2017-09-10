/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.delete()
}

export const input = (
  <state>
    <document>
      <quote>
        <paragraph>one<anchor /></paragraph>
        <paragraph><focus />two</paragraph>
        <paragraph>three</paragraph>
      </quote>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <quote>
        <paragraph>one<cursor />two</paragraph>
        <paragraph>three</paragraph>
      </quote>
    </document>
  </state>
)
