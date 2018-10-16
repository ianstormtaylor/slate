/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.moveToEndOfNextBlock()
}

export const input = (
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
