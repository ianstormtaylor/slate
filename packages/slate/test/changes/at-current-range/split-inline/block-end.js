/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.splitInline()
}

export const input = (
  <state>
    <document>
      <paragraph>
        <link>word<cursor /></link>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <link>word<cursor /></link>
      </paragraph>
    </document>
  </state>
)
