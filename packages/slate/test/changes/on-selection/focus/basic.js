/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.focus()
}

export const input = (
  <state>
    <document>
      <paragraph>one</paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph><cursor />one</paragraph>
    </document>
  </state>
)
