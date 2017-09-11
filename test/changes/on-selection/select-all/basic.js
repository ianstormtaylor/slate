/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.selectAll()
}

export const input = (
  <state>
    <document>
      <paragraph>
        <cursor />one
      </paragraph>
      <paragraph>
        two
      </paragraph>
      <paragraph>
        three
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <anchor />one
      </paragraph>
      <paragraph>
        two
      </paragraph>
      <paragraph>
        three<focus />
      </paragraph>
    </document>
  </state>
)
