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
      <paragraph></paragraph>
      <image></image>
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
