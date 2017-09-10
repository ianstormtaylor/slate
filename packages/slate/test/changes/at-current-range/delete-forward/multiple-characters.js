/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.deleteForward(3)
}

export const input = (
  <state>
    <document>
      <paragraph>
        <cursor />word
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        d
      </paragraph>
    </document>
  </state>
)
