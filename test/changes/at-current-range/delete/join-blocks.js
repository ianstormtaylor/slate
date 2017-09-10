/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.delete()
}

export const input = (
  <state>
    <document>
      <paragraph>
        word<anchor />
      </paragraph>
      <paragraph>
        <focus />another
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        word<cursor />another
      </paragraph>
    </document>
  </state>
)
