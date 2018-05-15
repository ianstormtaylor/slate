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
      <paragraph>
        tw<focus />o
      </paragraph>
      <paragraph>three</paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <cursor />o
      </paragraph>
      <paragraph>three</paragraph>
    </document>
  </value>
)
