/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.moveToEndOfPreviousBlock()
}

export const input = (
  <value>
    <document>
      <paragraph>one</paragraph>
      <paragraph>
        t<cursor />wo
      </paragraph>
      <paragraph>three</paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        one<cursor />
      </paragraph>
      <paragraph>two</paragraph>
      <paragraph>three</paragraph>
    </document>
  </value>
)
