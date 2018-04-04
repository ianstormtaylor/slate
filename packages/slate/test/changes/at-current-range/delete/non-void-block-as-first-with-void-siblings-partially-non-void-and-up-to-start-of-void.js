/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.delete()
}

export const input = (
  <value>
    <document>
      <paragraph>
        on<anchor />e
      </paragraph>
      <image>
        <focus />
      </image>
      <paragraph>three</paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        on<cursor />
      </paragraph>
      <paragraph>three</paragraph>
    </document>
  </value>
)
