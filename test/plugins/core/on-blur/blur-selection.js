/** @jsx h */

import h from '../../../helpers/h'

export default function (simulator) {
  simulator.blur()
}

export const input = (
  <state>
    <document>
      <paragraph />
    </document>
    <selection isFocused />
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph />
    </document>
    <selection isFocused={false} />
  </state>
)
