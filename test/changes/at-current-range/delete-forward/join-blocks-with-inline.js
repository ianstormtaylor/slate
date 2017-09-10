/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.deleteForward()
}

export const input = (
  <state>
    <document>
      <paragraph>
        one<cursor />
      </paragraph>
      <paragraph>
        two<link>three</link>four
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
