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
      <image></image>
      <paragraph></paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <image></image>
    </document>
  </state>
)
