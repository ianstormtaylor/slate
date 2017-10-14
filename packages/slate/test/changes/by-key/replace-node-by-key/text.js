/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.replaceNodeByKey('a', { kind: 'text', leaves: [{ text: 'three' }] })
}

export const input = (
  <state>
    <document>
      <paragraph>
        one
      </paragraph>
      <paragraph>
        <text key="a">one</text>
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
      <paragraph>
        three
      </paragraph>
    </document>
  </state>
)
