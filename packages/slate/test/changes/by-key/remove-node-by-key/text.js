/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.removeNodeByKey('a')
}

export const input = (
  <state>
    <document>
      <paragraph>
        <text key="a"><cursor />one</text>
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
      <paragraph />
      <paragraph>
        <cursor />two
      </paragraph>
    </document>
  </state>
)
