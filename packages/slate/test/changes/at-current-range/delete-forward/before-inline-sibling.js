/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.deleteForward()
}

export const input = (
  <state>
    <document>
      <paragraph>
        one<link>two</link><cursor />a
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
