/** @jsx h */

import h from '../../../helpers/h'

export default function(simulator) {
  simulator.keyDown({ key: 'Enter' })
}

export const input = (
  <value>
    <document>
      <paragraph>
        <cursor />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph />
      <paragraph>
        <cursor />
      </paragraph>
    </document>
  </value>
)
