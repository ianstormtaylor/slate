/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.deleteBackward()
}

export const input = (
  <state>
    <document>
      <paragraph>
        one<link>a<cursor /></link>two
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        one<cursor />two
      </paragraph>
    </document>
  </state>
)
