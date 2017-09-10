/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const nodeToBeFocused = document.nodes.first()
  return state
    .change()
    .collapseToStartOf(nodeToBeFocused)
    .deleteForward()
}

export const input = (
  <state>
    <document>
      <x-paragraph></x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph></x-paragraph>
    </document>
  </state>
)
