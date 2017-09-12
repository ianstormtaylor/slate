/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.deleteBackward()
}

export const input = (
  <state>
    <document>
      <paragraph>
        word
      </paragraph>
      <paragraph>
        <cursor />another
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        word<cursor />another
      </paragraph>
    </document>
  </state>
)
