/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.moveToEndOfDocument()
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
      <paragraph>one</paragraph>
      <paragraph>two</paragraph>
      <paragraph>
        three<cursor />
      </paragraph>
    </document>
  </value>
)
