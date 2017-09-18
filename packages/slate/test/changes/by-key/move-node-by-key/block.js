/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.moveNodeByKey('a', 'b', 1)
}

export const input = (
  <state>
    <document key="b">
      <paragraph key="a">
        <cursor />one
      </paragraph>
      <paragraph>
        two
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        two
      </paragraph>
      <paragraph>
        <cursor />one
      </paragraph>
    </document>
  </state>
)
