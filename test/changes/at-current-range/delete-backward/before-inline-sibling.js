/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.deleteBackward()
}

export const input = (
  <state>
    <document>
      <paragraph>
        one<link>two</link>a<cursor />
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        one<link>two</link>
      </paragraph>
    </document>
  </state>
)
