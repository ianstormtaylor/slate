/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.moveToEndOfBlock()
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
      <paragraph>one</paragraph>
      <paragraph>
        two<cursor />
      </paragraph>
      <paragraph>three</paragraph>
    </document>
  </value>
)
