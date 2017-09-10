/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.removeTextByKey('a', 3, 1)
}

export const input = (
  <state>
    <document>
      <paragraph>
        <text key="a">word</text>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        wor
      </paragraph>
    </document>
  </state>
)
