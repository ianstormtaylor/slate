/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.delete()
}

export const input = (
  <value>
    <document>
      <image>
        <anchor />
      </image>
      <image>
        <focus />
      </image>
      <paragraph>one</paragraph>
      <paragraph>two</paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <cursor />one
      </paragraph>
      <paragraph>two</paragraph>
    </document>
  </value>
)
