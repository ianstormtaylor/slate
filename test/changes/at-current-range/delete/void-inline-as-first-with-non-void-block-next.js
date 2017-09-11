/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.delete()
}

export const input = (
  <state>
    <document>
      <paragraph>
        one<emoji><anchor /></emoji>two
      </paragraph>
      <paragraph>
        <focus />three
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        one<cursor />three
      </paragraph>
    </document>
  </state>
)
