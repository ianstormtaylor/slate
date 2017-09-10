/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.removeTextByKey('a', 0, 1)
}

export const input = (
  <state>
    <document>
      <paragraph>
        <emoji /><text key="a">a</text><link>two</link>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <emoji /><link>two</link>
      </paragraph>
    </document>
  </state>
)
