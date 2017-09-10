/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.blur()
}

export const input = (
  <state>
    <document>
      <paragraph>
        <cursor />one
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        one
      </paragraph>
    </document>
  </state>
)
