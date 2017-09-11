/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.deleteCharForward()
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
        wo<cursor />d
      </paragraph>
    </document>
  </state>
)
