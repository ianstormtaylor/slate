/** @jsx h */

import h from '../../../helpers/h'

export default function (simulator) {
  simulator.keyDown({ key: 'Enter' })
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
