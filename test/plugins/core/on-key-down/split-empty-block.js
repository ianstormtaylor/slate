/** @jsx h */

import h from '../../../helpers/h'

export default function (simulator) {
  simulator.keyDown(null, { key: 'enter' })
}

export const input = (
  <state>
    <document>
      <paragraph>
        <cursor />
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph />
      <paragraph>
        <cursor />
      </paragraph>
    </document>
  </state>
)
