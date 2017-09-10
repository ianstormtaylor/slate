/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  return state
    .change()
    .removeNodeByKey('b')

    .change()
    .undo()
    .state
}

export const input = (
  <state>
    <document>
      <image></image>
      <image></image>
      <image></image>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <image></image>
      <image></image>
      <image></image>
    </document>
  </state>
)
