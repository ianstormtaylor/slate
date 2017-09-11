/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.delete()
}

export const input = (
  <state>
    <document>
      <paragraph>
        one<anchor />
      </paragraph>
      <paragraph>
        <focus />two<link>three</link>four
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
