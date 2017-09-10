/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.moveNodeByKey('a', 'b', 1)
}

export const input = (
  <state>
    <document>
      <paragraph key="b">
        one
      </paragraph>
      <paragraph>
        <text key="a">two</text>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        onetwo
      </paragraph>
      <paragraph />
    </document>
  </state>
)
