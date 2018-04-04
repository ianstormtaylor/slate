/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.delete()
}

export const input = (
  <value>
    <document>
      <paragraph>
        <anchor />one
      </paragraph>
      <image>
        <focus />
      </image>
      <paragraph>two</paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <image>
        <cursor />
      </image>
      <paragraph>two</paragraph>
    </document>
  </value>
)
