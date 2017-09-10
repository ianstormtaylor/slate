/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const nodeToBeFocused = document.nodes.last()
  return state
    .change()
    .collapseToStartOf(nodeToBeFocused)
    .deleteBackward()
}

export const input = (
  <state>
    <document>
      <x-image></x-image>
      <x-paragraph></x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-image></x-image>
    </document>
  </state>
)
