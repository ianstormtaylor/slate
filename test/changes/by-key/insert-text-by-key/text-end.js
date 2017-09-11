/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.insertTextByKey('a', 4, 'x')
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
        wordx
      </paragraph>
    </document>
  </state>
)
