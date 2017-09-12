/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.insertTextByKey('a', 0, 'a')
}

export const input = (
  <state>
    <document>
      <paragraph>
        <text key="a">wo<cursor />rd</text>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        awo<cursor />rd
      </paragraph>
    </document>
  </state>
)
