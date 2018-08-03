/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.moveToRangeOfDocument()
}

export const input = (
  <value>
    <document>
      <paragraph>
        <cursor />one
      </paragraph>
      <paragraph>two</paragraph>
      <paragraph>three</paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <anchor />one
      </paragraph>
      <paragraph>two</paragraph>
      <paragraph>
        three<focus />
      </paragraph>
    </document>
  </value>
)
