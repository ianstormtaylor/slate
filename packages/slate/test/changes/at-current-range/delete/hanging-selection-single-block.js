/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.delete()
}

export const input = (
  <state>
    <document>
      <paragraph>
        <anchor />one
      </paragraph>
      <quote>
        <focus />two
      </quote>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <quote>
        <cursor />two
      </quote>
    </document>
  </state>
)
