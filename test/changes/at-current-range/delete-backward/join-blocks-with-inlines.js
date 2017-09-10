/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.deleteBackward()
}

export const input = (
  <state>
    <document>
      <paragraph>
        one
      </paragraph>
      <paragraph>
        <cursor />two<link>three</link>four
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        one<cursor />two<link>three</link>four
      </paragraph>
    </document>
  </state>
)
