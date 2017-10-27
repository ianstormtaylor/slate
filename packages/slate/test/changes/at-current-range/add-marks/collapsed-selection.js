/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change
    .addMarks(['bold', 'italic'])
    .insertText('a')
}

export const input = (
  <state>
    <document>
      <paragraph>
        <cursor />word
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
      <i><b>a</b></i><cursor />word
      </paragraph>
    </document>
  </state>
)
