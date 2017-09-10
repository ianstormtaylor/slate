/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.removeNodeByKey('a')
}

export const input = (
  <state>
    <document>
      <paragraph>
        one
      </paragraph>
      <paragraph key="a">
        two
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
