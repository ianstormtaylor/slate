/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.deleteBackward()
}

export const input = (
  <state>
    <document>
      <paragraph>
        wo<cursor />rd
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        w<cursor />rd
      </paragraph>
    </document>
  </state>
)
