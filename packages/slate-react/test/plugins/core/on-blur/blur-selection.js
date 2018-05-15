/** @jsx h */

import h from '../../../helpers/h'

export default function(simulator) {
  simulator.blur()
}

export const input = (
  <value>
    <document>
      <paragraph />
    </document>
    <selection isFocused />
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph />
    </document>
    <selection isFocused={false} />
  </value>
)
