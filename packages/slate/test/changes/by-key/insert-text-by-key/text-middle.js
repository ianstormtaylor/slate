/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.insertTextByKey('a', 2, 'x')
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
        woxrd
      </paragraph>
    </document>
  </state>
)
