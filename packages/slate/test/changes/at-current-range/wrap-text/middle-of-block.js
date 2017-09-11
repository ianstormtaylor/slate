/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.wrapText('[[', ']]')
}

export const input = (
  <state>
    <document>
      <paragraph>
        w<anchor />or<focus />d
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        w[[<anchor />or<focus />]]d
      </paragraph>
    </document>
  </state>
)
