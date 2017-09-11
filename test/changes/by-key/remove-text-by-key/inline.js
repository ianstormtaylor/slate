/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.removeTextByKey('a', 3, 1)
}

export const input = (
  <state>
    <document>
      <paragraph>
        <link><text key="a">word</text></link>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <link>wor</link>
      </paragraph>
    </document>
  </state>
)
