/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.collapseToAnchor()
}

export const input = (
  <state>
    <document>
      <paragraph>
        <anchor />one<focus />
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <cursor />one
      </paragraph>
    </document>
  </state>
)
