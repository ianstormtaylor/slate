/** @jsx h */

import { h } from 'slate-core-test-helpers'

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
