/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.insertTextByKey('a', 2, 'x', [{ type: 'bold' }])
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
        wo<b>x</b>rd
      </paragraph>
    </document>
  </state>
)
