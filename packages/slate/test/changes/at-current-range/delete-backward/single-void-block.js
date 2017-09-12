/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.deleteBackward()
}

export const input = (
  <state>
    <document>
      <image>
        <cursor />{' '}
      </image>
    </document>
  </state>
)

export const output = (
  <state>
    <document />
  </state>
)
