/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  return state
    .change()
    .removeNodeByKey('bb')
    .removeNodeByKey('b')

    .change()
    .undo()
    .state
}

export const input = (
  <state>
    <document>
      <figure>
        <image></image>
      </figure>
      <figure>
        <image></image>
      </figure>
      <figure>
        <image></image>
      </figure>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <figure>
        <image></image>
      </figure>
      <figure>
        <image></image>
      </figure>
      <figure>
        <image></image>
      </figure>
    </document>
  </state>
)
